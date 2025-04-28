
import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSessionInit({
  setSession,
  setUser,
  setUserRole,
  setProfile,
  setIsLoading,
  setInitialized,
  clearAuthState,
  fetchUserProfile
}: {
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setUserRole: (role: string | null) => void;
  setProfile: (profile: any) => void;
  setIsLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuthState: () => void;
  fetchUserProfile: (userId: string, role: string, email: string | undefined) => Promise<any>;
}) {
  const handleAuthStateChange = useCallback(async (session: any) => {
    setSession(session);
    setUser(session?.user || null);
            
    if (session?.user) {
      try {
        const { data, error } = await supabase.from('accounts')
          .select('role')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
                
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
  }, [clearAuthState, fetchUserProfile, setIsLoading, setProfile, setSession, setUser, setUserRole]);

  useEffect(() => {
    // Important flag to prevent state updates after unmounting
    let isMounted = true;
    
    const initSession = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      
      try {
        // Set up the auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_, session) => {
            if (isMounted) {
              await handleAuthStateChange(session);
            }
          }
        );
        
        // Then check for an existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            clearAuthState();
          }
        } else if (session) {
          if (isMounted) {
            await handleAuthStateChange(session);
          }
        } else {
          if (isMounted) {
            setIsLoading(false);
          }
        }
        
        // Set initialized to true only if component is still mounted
        if (isMounted) {
          setInitialized(true);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        if (isMounted) {
          clearAuthState();
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };
    
    initSession();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [clearAuthState, handleAuthStateChange, setInitialized, setIsLoading]);
}
