
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function useParticipantProfile(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['participant-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', userId)
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
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<ParticipantProfileData>) => {
      if (!userId) throw new Error('User ID is required');

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('participants_profile')
        .select('id')
        .eq('id', userId)
        .single();

      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('participants_profile')
          .update(profileData)
          .eq('id', userId)
          .select('*')
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from('participants_profile')
          .insert({ id: userId, ...profileData })
          .select('*')
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['participant-profile', userId] });
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
