
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

export function useEmployerProfile(accountId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['employer-profile', accountId],
    queryFn: async () => {
      if (!accountId) return null;

      // Check if account has employee type in accounts table
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('type')
        .eq('id', accountId)
        .eq('type', 'employee')
        .single();

      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error checking account type:', accountError);
        throw accountError;
      }

      // Only proceed if account is an employee type
      if (!accountData) {
        console.log("Account is not an employee type");
        return null;
      }

      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', accountId)
        .single();

      if (error) {
        console.error('Error fetching employer profile:', error);
        
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        
        throw error;
      }

      return data as EmployerProfileData;
    },
    enabled: !!accountId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<EmployerProfileData>) => {
      if (!accountId) throw new Error('Account ID is required');

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('id', accountId)
        .single();

      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('employer_profiles')
          .update(profileData)
          .eq('id', accountId)
          .select('*')
          .single();

        if (error) throw error;
        result = data;
        
        // Also update display_name in accounts
        if (profileData.first_name || profileData.last_name) {
          const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
          await supabase
            .from('accounts')
            .update({ display_name: displayName })
            .eq('id', accountId);
        }
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from('employer_profiles')
          .insert({ id: accountId, ...profileData })
          .select('*')
          .single();

        if (error) throw error;
        result = data;
        
        // Set display_name in accounts
        if (profileData.first_name || profileData.last_name) {
          const displayName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
          await supabase
            .from('accounts')
            .update({ display_name: displayName })
            .eq('id', accountId);
        }
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['employer-profile', accountId] });
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
