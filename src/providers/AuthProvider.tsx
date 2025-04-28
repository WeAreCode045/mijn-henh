
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserBase } from '@/types/user';
import { EmployerProfileData } from '@/hooks/useEmployerProfile';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserBase | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
  isParticipant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user || null);
      
      if (initialSession?.user) {
        await fetchUserProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event);
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else {
            setProfile(null);
            setUserRole(null);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user role and profile for:", userId);
      
      // First check what role the user has from users_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('users_roles')
        .select('role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') {
        console.error("Error fetching user role:", roleError);
      }
      
      const role = roleData?.role || null;
      console.log("User role:", role);
      setUserRole(role);
      
      // Fetch profile data based on role
      if (role === 'admin' || role === 'agent') {
        // Fetch from employer_profiles
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching employer profile:", error);
        } else if (data) {
          const employerProfile = data as EmployerProfileData;
          setProfile({
            id: employerProfile.id,
            email: employerProfile.email || '',
            full_name: `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim(),
            phone: employerProfile.phone || undefined,
            whatsapp_number: employerProfile.whatsapp_number || undefined,
            avatar_url: employerProfile.avatar_url || undefined,
            role: role
          });
        }
      } else if (role === 'buyer' || role === 'seller') {
        // Fetch from participants_profile
        const { data, error } = await supabase
          .from('participants_profile')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching participant profile:", error);
        } else if (data) {
          setProfile({
            id: data.id,
            email: data.email || '',
            full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            phone: data.phone || undefined,
            whatsapp_number: data.whatsapp_number || undefined,
            role: role
          });
        }
      } else {
        console.log("User has no role assigned or profile not found");
        setProfile({
          id: userId,
          email: user?.email || '',
          full_name: '',
          role: null
        });
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const isAdmin = userRole === 'admin';
  const isAgent = userRole === 'agent' || userRole === 'admin';  // Admins have agent abilities
  const isParticipant = userRole === 'buyer' || userRole === 'seller';
  
  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      signIn,
      signOut,
      isAdmin,
      isAgent,
      isParticipant
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
