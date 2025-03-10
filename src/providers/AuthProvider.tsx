
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
  // We'll use the direct import as a fallback
  const supabaseFromHook = useSupabaseClient<Database>();
  const supabaseClient = supabaseFromHook || supabase;
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Check if supabaseClient is available before setting up auth listener
    if (!supabaseClient || !supabaseClient.auth) {
      console.error('Supabase client not available');
      setIsError(true);
      setIsLoading(false);
      return () => {};
    }

    // Set up auth state listener
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession?.user) {
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
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      // Clean up listener
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabaseClient]);

  useEffect(() => {
    async function fetchProfile() {
      // Check if supabaseClient is available before fetching profile
      if (!supabaseClient || !supabaseClient.from) {
        console.error('Supabase client not available for fetching profile');
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);

      if (session?.user?.id) {
        try {
          const { data, error } = await supabaseClient
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
  }, [session, supabaseClient]);

  const signOut = async () => {
    console.log('Signing out...');
    try {
      if (!supabaseClient || !supabaseClient.auth) {
        throw new Error('Supabase client not available for sign out');
      }
      
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const value: AuthContextProps = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    isError,
    supabaseClient,
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
