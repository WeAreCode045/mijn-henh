
import { useCallback, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setUserRole(null);
    setProfile(null);
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    userRole,
    setUserRole,
    profile,
    setProfile,
    isLoading,
    setIsLoading,
    initialized,
    setInitialized,
    clearAuthState,
  };
}
