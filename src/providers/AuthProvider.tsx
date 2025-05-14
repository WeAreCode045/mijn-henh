
import React, { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { User as AppUser } from '@/types/user';
import { useSession } from '@/hooks/auth/useSession';
import { useProfileFetch } from '@/hooks/auth/useProfileFetch';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';
import { useSessionInit } from '@/hooks/auth/useSessionInit';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
  console.log("AuthProvider - Initializing");
  
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
  
  useSessionInit({
    setSession,
    setUser,
    setUserRole,
    setProfile,
    setIsLoading,
    setInitialized,
    clearAuthState,
    fetchUserProfile
  });

  // Ensure the role is correctly determined from all possible sources
  const effectiveRole = profile?.role || userRole;
  const isAdmin = effectiveRole === 'admin';
  const isAgent = effectiveRole === 'agent' || effectiveRole === 'admin';

  // Debug log to verify provider state
  console.log("AuthProvider - State:", { 
    user: user?.id, 
    initialized,
    isLoading,
    userRole,
    profileRole: profile?.role,
    effectiveRole,
    isAdmin,
    isAgent 
  });

  const value = {
    user,
    session,
    isLoading,
    ...authMethods,
    isAdmin,
    isAgent,
    userRole: effectiveRole || null,
    profile,
    initialized,
  };

  if (isLoading && !initialized) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  console.log("useAuth hook called");
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
