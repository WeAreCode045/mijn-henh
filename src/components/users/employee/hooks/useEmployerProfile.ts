
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface EmployerProfileData {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  avatar_url?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  role?: string | null;
  agency_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useEmployerProfile(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['employer-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Check if user has employee type in accounts table using user_id
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('type, user_id')
        .eq('user_id', userId)
        .eq('type', 'employee')
        .maybeSingle();

      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error checking account type:', accountError);
        throw accountError;
      }

      // Only proceed if account is an employee type
      if (!accountData) {
        console.log("Account is not an employee type");
        return null;
      }

      // Fetch from employer_profiles using user_id (now properly linked via FK)
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching employer profile:', error);
        throw error;
      }

      return data as EmployerProfileData;
    },
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<EmployerProfileData>) => {
      if (!userId) throw new Error('User ID is required');

      // Use upsert to handle both insert and update cases
      const { data, error } = await supabase
        .from('employer_profiles')
        .upsert({ id: userId, ...profileData })
        .select('*')
        .single();

      if (error) throw error;

      // The trigger will automatically update display_name in accounts table
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['employer-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh users list
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
  };
}
