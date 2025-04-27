
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  user: User | null;
  profile: {
    updated_at: never;
    created_at: never;
    whatsapp_number: unknown;
    phone: never;
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'admin' | 'agent' | 'seller' | 'buyer' | null;
    avatar_url: string | null;
  } | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isSeller: boolean;
  isBuyer: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  isAgent: false,
  isSeller: false,
  isBuyer: false
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthContextProps['profile']>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Load profile data if we have a user
        if (newSession?.user) {
          setTimeout(async () => {
            await fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session (which might trigger the listener above)
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data as AuthContextProps['profile']);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };
  
  const isAdmin = profile?.role === 'admin';
  const isAgent = profile?.role === 'agent';
  const isSeller = profile?.role === 'seller';
  const isBuyer = profile?.role === 'buyer';

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAdmin,
    isAgent,
    isSeller,
    isBuyer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
