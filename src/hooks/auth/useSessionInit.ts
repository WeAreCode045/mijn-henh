
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
    console.log('Auth state change', session ? 'Session exists' : 'No session');
    setSession(session);
    setUser(session?.user || null);
            
    if (session?.user) {
      try {
        // Get the user's role from the accounts table
        const { data: accountData, error: accountError } = await supabase.from('accounts')
          .select('role')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
                
        if (accountError) {
          console.error('Error getting user role on auth change:', accountError);
          setUserRole(null);
        } else if (accountData) {
          console.log('User role from accounts:', accountData.role);
          setUserRole(accountData.role);
          
          // Fetch the user profile based on role
          const userProfile = await fetchUserProfile(session.user.id, accountData.role, session.user.email);
          if (userProfile) {
            console.log('User profile fetched:', userProfile);
            setProfile(userProfile);
          } else {
            console.log('No profile found for user');
          }
        } else {
          console.log('No account found for user');
          setUserRole(null);
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
      console.log('Initializing auth session...');
      
      try {
        // First check for an existing session
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (isMounted) {
            clearAuthState();
            setIsLoading(false);
          }
        } else if (existingSession) {
          // We have a session, apply it immediately
          console.log('Existing session found:', existingSession.user?.id);
          if (isMounted) {
            await handleAuthStateChange(existingSession);
          }
        } else {
          console.log('No existing session found');
          if (isMounted) {
            setIsLoading(false);
          }
        }
        
        // Then set up the auth state change listener for future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_, session) => {
            console.log('Auth state change event triggered');
            if (isMounted) {
              await handleAuthStateChange(session);
            }
          }
        );
        
        // Set initialized to true only if component is still mounted
        if (isMounted) {
          console.log('Auth initialization complete');
          setInitialized(true);
        }
        
        // Return cleanup function
        return () => {
          console.log('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Unexpected error in initSession:', err);
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
