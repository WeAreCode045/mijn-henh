
import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';
import { useSession } from '@/hooks/auth/useSession';
import { useProfileFetch } from '@/hooks/auth/useProfileFetch';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
  userRole: string | null;
  profile: AppUser | null;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user, setUser,
    session, setSession,
    userRole, setUserRole,
    profile, setProfile,
    isLoading, setIsLoading,
    initialized, setInitialized,
    clearAuthState
  } = useSession();

  const { fetchUserProfile } = useProfileFetch();
  const authMethods = useAuthMethods(setIsLoading);
  
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user || null);
            
            if (session?.user) {
              try {
                const { data, error } = await supabase.from('accounts')
                  .select('role')
                  .eq('user_id', session.user.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single();
                  
                if (error) {
                  console.error('Error getting user role on auth change:', error);
                  setUserRole(null);
                } else if (data) {
                  setUserRole(data.role);
                  const userProfile = await fetchUserProfile(session.user.id, data.role, session.user.email);
                  if (userProfile) {
                    setProfile(userProfile);
                  }
                }
              } catch (err) {
                console.error('Unexpected error in auth state change:', err);
              } finally {
                setIsLoading(false);
              }
            } else {
              clearAuthState();
              setIsLoading(false);
            }
          }
        );
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          clearAuthState();
        } else if (session) {
          setSession(session);
          setUser(session.user);
          
          const { data: roleData, error: roleError } = await supabase
            .from('accounts')
            .select('role')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (roleError) {
            console.error('Error getting user role:', roleError);
          } else if (roleData) {
            setUserRole(roleData.role);
            const userProfile = await fetchUserProfile(session.user.id, roleData.role, session.user.email);
            if (userProfile) {
              setProfile(userProfile);
            }
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        clearAuthState();
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    getSession();
  }, [clearAuthState, fetchUserProfile, setInitialized, setIsLoading, setProfile, setSession, setUser, setUserRole]);

  const isAdmin = userRole === 'admin';
  const isAgent = userRole === 'agent' || userRole === 'admin';

  const value = {
    user,
    session,
    isLoading,
    ...authMethods,
    isAdmin,
    isAgent,
    userRole,
    profile,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
