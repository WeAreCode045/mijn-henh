
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Session,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  supabaseClient: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const session = useSession();
  const supabaseFromHook = useSupabaseClient<Database>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  
  // Log client availability to help with debugging
  console.log("AuthProvider - Initialization", {
    hasHookClient: !!supabaseFromHook?.auth,
    hasDirectClient: !!supabase?.auth,
    hasSession: !!session
  });

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Always use the direct import for consistency
    if (!supabase?.auth) {
      console.error('Supabase auth not available');
      setIsError(true);
      setIsLoading(false);
      return () => {};
    }

    try {
      // Set up auth state listener using the direct import
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log('Auth state changed:', event, newSession?.user?.id);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (newSession?.user) {
              console.log('User signed in or token refreshed:', newSession.user.id);
              const userData: User = {
                id: newSession.user.id,
                email: newSession.user.email,
                full_name: null,
                phone: null,
                whatsapp_number: null,
                role: null,
                avatar_url: null
              };
              setUser(userData);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing user data');
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        }
      );

      return () => {
        // Clean up listener
        console.log("Cleaning up auth state listener");
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsError(true);
      setIsLoading(false);
      return () => {};
    }
  }, []);  // Remove the dependency on supabaseClient to avoid re-running

  useEffect(() => {
    async function fetchProfile() {
      // Always use the direct import for consistency
      if (!supabase || !supabase.from) {
        console.error('Supabase client not available for fetching profile');
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);

      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            setIsError(true);
            console.error('Error fetching profile:', error);
            return;
          }

          if (data) {
            const userProfile: User = {
              id: data.id,
              email: data.email,
              full_name: data.full_name,
              phone: data.phone,
              whatsapp_number: data.whatsapp_number,
              role: data.role,
              avatar_url: data.avatar_url,
            };
            setProfile(userProfile);
            setIsAdmin(data.role === 'admin');
          }
        } catch (error) {
          setIsError(true);
          console.error('Unexpected error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    }

    if (session?.user) {
      const userData: User = {
        id: session.user.id,
        email: session.user.email,
        full_name: null,
        phone: null,
        whatsapp_number: null,
        role: null,
        avatar_url: null
      };
      setUser(userData);
      fetchProfile();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [session]);

  const signOut = async () => {
    console.log('Signing out...');
    try {
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client not available for sign out');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  // Use the direct import client for consistency
  const value: AuthContextProps = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    isError,
    supabaseClient: supabase,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
