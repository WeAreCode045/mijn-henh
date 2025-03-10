import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Session,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/user';
import { 
  mainSupabaseClient, 
  backupSupabaseClient, 
  getSupabaseClient, 
  syncSupabaseClients 
} from '@/integrations/supabase/clientManager';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  supabaseClient: any;
  signOut: () => Promise<void>;
  isUsingBackupClient: boolean;
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
  const [supabaseClient, setSupabaseClient] = useState<any>(mainSupabaseClient);
  const [isUsingBackupClient, setIsUsingBackupClient] = useState<boolean>(false);
  
  // Log client availability to help with debugging
  console.log("AuthProvider - Initialization", {
    hasHookClient: !!supabaseFromHook?.auth,
    hasDirectMainClient: !!mainSupabaseClient?.auth,
    hasDirectBackupClient: !!backupSupabaseClient?.auth,
    hasSession: !!session,
    isUsingBackupClient
  });

  // Initialize and keep the Supabase client updated
  useEffect(() => {
    const initializeClient = async () => {
      try {
        console.log("AuthProvider: Initializing Supabase client");
        
        // First sync clients to ensure sessions are consistent
        await syncSupabaseClients();
        
        // Get the best available client
        const client = await getSupabaseClient();
        
        if (!client) {
          console.error('No Supabase client available');
          setIsError(true);
          setIsLoading(false);
          return;
        }
        
        setSupabaseClient(client);
        setIsUsingBackupClient(client === backupSupabaseClient);
        
        console.log("Supabase client initialized:", {
          isBackup: client === backupSupabaseClient,
          hasAuth: !!client?.auth
        });
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    initializeClient();
    
    // Set up a periodic check to ensure we have the best client
    const interval = setInterval(async () => {
      try {
        const client = await getSupabaseClient();
        if (client && client !== supabaseClient) {
          setSupabaseClient(client);
          setIsUsingBackupClient(client === backupSupabaseClient);
          console.log("Switched Supabase client:", {
            isBackup: client === backupSupabaseClient
          });
        }
      } catch (error) {
        console.error('Error in client check interval:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);  // Run once on mount

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Safety check before setting up listener
    if (!supabaseClient?.auth) {
      console.error('Supabase auth not available for auth state listener');
      setIsError(true);
      setIsLoading(false);
      return () => {};
    }

    try {
      // Set up auth state listener using the current client
      const { data: authListener } = supabaseClient.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event, newSession?.user?.id);
          
          // Sync clients whenever auth state changes
          await syncSupabaseClients();
          
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
  }, [supabaseClient]);  // Re-run when supabaseClient changes

  useEffect(() => {
    async function fetchProfile() {
      // Safety check
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
      
      // Ensure sessions are cleared from both clients
      try {
        await mainSupabaseClient.auth.signOut();
        await backupSupabaseClient.auth.signOut();
      } catch (clearError) {
        console.error('Error clearing other client sessions:', clearError);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  // Use the current client
  const value: AuthContextProps = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    isError,
    supabaseClient,
    signOut,
    isUsingBackupClient,
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
