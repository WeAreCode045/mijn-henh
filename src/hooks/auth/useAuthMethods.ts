
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthMethods(setIsLoading: (loading: boolean) => void) {
  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
      const { error } = await supabase.auth.signOut();
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
