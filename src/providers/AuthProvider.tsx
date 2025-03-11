
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Session,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/user';

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
  const supabaseClient = useSupabaseClient<Database>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProfile() {
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
            const userData: User = {
              id: data.id,
              email: data.email,
              full_name: data.full_name,
              phone: data.phone,
              whatsapp_number: data.whatsapp_number,
              role: data.role,
              avatar_url: data.avatar_url,
            };
            setProfile(userData);
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

    setUser(session?.user || null);
    fetchProfile();
  }, [session, supabaseClient]);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
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
