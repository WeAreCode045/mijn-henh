
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function useParticipantProfile(accountId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['participant-profile', accountId],
    queryFn: async () => {
      if (!accountId) return null;

      // Check if account has participant type in accounts table
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('type')
        .eq('id', accountId)
        .eq('type', 'participant')
        .single();

      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error checking account type:', accountError);
        throw accountError;
      }

      // Only proceed if account is a participant type
      if (!accountData) {
        console.log("Account is not a participant type");
        return null;
      }

      const { data, error } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', accountId)
        .single();

      if (error) {
        console.error('Error fetching participant profile:', error);
        
        // If the profile doesn't exist, we should return null rather than throwing
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        
        throw error;
      }

      return data as ParticipantProfileData;
    },
    enabled: !!accountId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<ParticipantProfileData>) => {
      if (!accountId) throw new Error('Account ID is required');

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('participants_profile')
        .select('id')
        .eq('id', accountId)
        .single();

      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('participants_profile')
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
          .from('participants_profile')
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
      queryClient.invalidateQueries({ queryKey: ['participant-profile', accountId] });
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
