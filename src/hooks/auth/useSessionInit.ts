
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
  fetchUserProfile: (userId: string, type: string, email: string | undefined) => Promise<any>;
}) {
  const handleAuthStateChange = useCallback(async (session: any) => {
    console.log('Auth state change', session ? 'Session exists' : 'No session');
    setSession(session);
    setUser(session?.user || null);
            
    if (session?.user) {
      try {
        // Get the user's type and role from the accounts table
        console.log('Fetching user account for', session.user.id);
        const { data: accountData, error: accountError } = await supabase.from('accounts')
          .select('id, type, role')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
                
        if (accountError) {
          console.error('Error getting user account on auth change:', accountError);
          setUserRole(null);
        } else if (accountData) {
          console.log('User account data:', accountData);
          
          // For employees, check if we need to sync the role from employer_profiles
          if (accountData.type === 'employee') {
            const { data: employerProfile } = await supabase
              .from('employer_profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (employerProfile && employerProfile.role && employerProfile.role !== accountData.role) {
              console.log('Role mismatch detected. Updating account role from', accountData.role, 'to', employerProfile.role);
              
              // Cast the role to the correct type before updating
              const validRole = employerProfile.role as 'admin' | 'agent' | 'buyer' | 'seller';
              
              // Update the account role to match employer profile
              const { error: updateError } = await supabase
                .from('accounts')
                .update({ role: validRole })
                .eq('user_id', session.user.id);
                
              if (!updateError) {
                console.log('Account role updated successfully');
                // Use the updated role
                setUserRole(validRole);
              } else {
                console.error('Failed to update account role:', updateError);
                setUserRole(accountData.role);
              }
            } else {
              setUserRole(accountData.role);
            }
          } else {
            setUserRole(accountData.role);
          }
          
          // Fetch the user profile based on type
          const userProfile = await fetchUserProfile(session.user.id, accountData.type, session.user.email);
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
