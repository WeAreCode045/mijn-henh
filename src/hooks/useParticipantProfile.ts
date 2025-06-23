
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function useParticipantProfile(participantUserId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['participant-profile', participantUserId],
    queryFn: async () => {
      if (!participantUserId) return null;

      console.log("useParticipantProfile - Fetching profile for user_id:", participantUserId);

      const { data, error } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', participantUserId)
        .single();

      if (error) {
        console.error('Error fetching participant profile:', error);
        
        // If the profile doesn't exist, we should return null rather than throwing
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        
        throw error;
      }

      console.log("useParticipantProfile - Retrieved profile:", data);

      // Add bank_account_number field for compatibility
      return {
        ...data,
        bank_account_number: data.iban || null
      } as unknown as ParticipantProfileData;
    },
    enabled: !!participantUserId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<ParticipantProfileData>) => {
      if (!participantUserId) throw new Error('Participant user ID is required');

      console.log("useParticipantProfile - Updating profile for user_id:", participantUserId, "with data:", profileData);

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('participants_profile')
        .select('id')
        .eq('id', participantUserId)
        .single();

      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('participants_profile')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', participantUserId)
          .select('*')
          .single();

        if (error) {
          console.error("Error updating participant profile:", error);
          throw error;
        }
        result = data;
        console.log("Profile updated successfully:", result);
        
        // Also update display_name in accounts
        if (profileData.first_name || profileData.last_name) {
          const displayName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
          const { error: accountError } = await supabase
            .from('accounts')
            .update({ 
              display_name: displayName,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', participantUserId);

          if (accountError) {
            console.error("Error updating account display_name:", accountError);
          }
        }
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from('participants_profile')
          .insert({ 
            id: participantUserId, 
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .select('*')
          .single();

        if (error) {
          console.error("Error creating participant profile:", error);
          throw error;
        }
        result = data;
        console.log("Profile created successfully:", result);
        
        // Set display_name in accounts
        if (profileData.first_name || profileData.last_name) {
          const displayName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
          const { error: accountError } = await supabase
            .from('accounts')
            .update({ 
              display_name: displayName,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', participantUserId);

          if (accountError) {
            console.error("Error updating account display_name:", accountError);
          }
        }
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'The participant profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['participant-profile', participantUserId] });
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
    onError: (error) => {
      console.error("Profile update mutation error:", error);
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
    isUpdating: updateProfileMutation.isPending,
  };
}
