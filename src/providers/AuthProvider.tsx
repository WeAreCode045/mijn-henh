
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Fetch user profile based on role
  const fetchUserProfile = useCallback(async (userId: string, role: string, email: string) => {
    if (role === 'admin' || role === 'agent') {
      const { data: employerProfile, error: profileError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching employer profile:', profileError);
      } else if (employerProfile) {
        const fullName = `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim();
        setProfile({
          id: userId,
          role: role,
          email: employerProfile.email || email,
          full_name: fullName || email.split('@')[0],
          avatar_url: employerProfile.avatar_url || undefined,
          phone: employerProfile.phone,
          whatsapp_number: employerProfile.whatsapp_number
        });
      }
    } else if (role === 'buyer' || role === 'seller') {
      const { data: participantProfile, error: profileError } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching participant profile:', profileError);
      } else if (participantProfile) {
        const fullName = `${participantProfile.first_name || ''} ${participantProfile.last_name || ''}`.trim();
        setProfile({
          id: userId,
          role: role,
          email: participantProfile.email || email,
          full_name: fullName || email.split('@')[0],
          avatar_url: undefined,
          phone: participantProfile.phone,
          whatsapp_number: participantProfile.whatsapp_number
        });
      }
    }
  }, []);
  
  // Clear auth state helper function
  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setUserRole(null);
    setProfile(null);
  }, []);
  
  useEffect(() => {
    // Get initial session only once on mount
    const getSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          clearAuthState();
          setIsLoading(false);
          return;
        }
        
        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Get user role from the accounts table
          const { data: roleData, error: roleError } = await supabase
            .from('accounts')
            .select('role, email')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (roleError) {
            console.error('Error getting user role:', roleError);
          } else if (roleData) {
            setUserRole(roleData.role);
            // Get additional profile information based on user role
            await fetchUserProfile(session.user.id, roleData.role, session.user.email);
          }
        } else {
          clearAuthState();
        }
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        clearAuthState();
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    getSession();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
              await fetchUserProfile(session.user.id, data.role, session.user.email);
            }
          } catch (err) {
            console.error('Unexpected error in auth state change:', err);
          }
        } else {
          clearAuthState();
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [clearAuthState, fetchUserProfile]);
  
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Manually clear auth state on sign out
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAdmin = userRole === 'admin';
  const isAgent = userRole === 'agent' || userRole === 'admin';
  
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
    isAgent,
    userRole,
    profile,
  };
  
  // Only provide the context if we've completed initialization
  // This prevents flash of logged-out state and premature redirects
  if (!initialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
      </div>
    );
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
