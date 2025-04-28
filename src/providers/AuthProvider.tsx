
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  profile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
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
          if (roleData.role === 'admin' || roleData.role === 'agent') {
            const { data: employerProfile, error: profileError } = await supabase
              .from('employer_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching employer profile:', profileError);
            } else if (employerProfile) {
              setProfile({
                ...employerProfile,
                role: roleData.role,
                email: employerProfile.email || roleData.email || session.user.email,
                full_name: `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim()
              });
            }
          } else if (roleData.role === 'buyer' || roleData.role === 'seller') {
            const { data: participantProfile, error: profileError } = await supabase
              .from('participants_profile')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching participant profile:', profileError);
            } else if (participantProfile) {
              setProfile({
                ...participantProfile,
                role: roleData.role,
                email: participantProfile.email || roleData.email || session.user.email,
                full_name: `${participantProfile.first_name || ''} ${participantProfile.last_name || ''}`.trim()
              });
            }
          }
        }
      }
      
      setIsLoading(false);
    };
    
    getSession();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      // Update role on auth state change
      if (session?.user) {
        supabase.from('accounts')
          .select('role')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error getting user role on auth change:', error);
            } else if (data) {
              setUserRole(data.role);
              
              // Fetch the appropriate profile data based on the role
              if (data.role === 'admin' || data.role === 'agent') {
                supabase
                  .from('employer_profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                  .then(({ data: profileData, error: profileError }) => {
                    if (!profileError && profileData) {
                      setProfile({
                        ...profileData,
                        role: data.role,
                        full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
                      });
                    }
                  });
              } else if (data.role === 'buyer' || data.role === 'seller') {
                supabase
                  .from('participants_profile')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                  .then(({ data: profileData, error: profileError }) => {
                    if (!profileError && profileData) {
                      setProfile({
                        ...profileData,
                        role: data.role,
                        full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
                      });
                    }
                  });
              }
            }
          });
      } else {
        setUserRole(null);
        setProfile(null);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      throw error;
    }
  };
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      throw error;
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
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
