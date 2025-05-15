
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthMethods(setIsLoading: (loading: boolean) => void) {
  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Signing in with email:", email);
      
      // Clean up any existing auth tokens first
      const cleanupAuthTokens = () => {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };
      
      // First sign out to ensure a clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
        cleanupAuthTokens();
      } catch (err) {
        console.error("Error during pre-login cleanup:", err);
        // Continue with login anyway
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Signing out user");
      
      // Clean up any persisted tokens
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Use global scope to make sure we sign out completely
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
