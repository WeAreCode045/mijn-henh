import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData, ParticipantRole } from '@/types/participant';
import { useToast } from '@/hooks/use-toast';

export function useParticipantProfile(participantUserId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['participant-profile', participantUserId],
    queryFn: async () => {
      if (!participantUserId) return null;

      console.log("useParticipantProfile - Fetching profile for user_id:", participantUserId);

      const { data: profileData, error: profileError } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', participantUserId)
        .single();

      if (profileError) {
        console.error('Error fetching participant profile:', profileError);
        if (profileError.code === 'PGRST116') {
          return null;
        }
        throw profileError;
      }

      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', participantUserId)
        .single();

      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error fetching account data:', accountError);
        throw accountError;
      }

      // Helper function to safely parse JSON data
      const safeParseJson = (jsonString: unknown): {
        type?: "passport" | "IDcard" | null;
        social_number?: string | null;
        document_number?: string | null;
      } | null => {
        if (!jsonString) return null;
        try {
          const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
          // Ensure the parsed data has the expected structure
          if (parsed && typeof parsed === 'object') {
            return {
              type: parsed.type || null,
              social_number: parsed.social_number || null,
              document_number: parsed.document_number || null
            };
          }
          return null;
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return null;
        }
      };

      // Parse identification data
      const identificationData = safeParseJson(profileData.identification);
      
      // Transform the data to match ParticipantProfileData type
      const transformedData: ParticipantProfileData = {
        ...profileData,
        // Map account data
        role: (accountData?.role as ParticipantRole) || 'buyer',
        // Ensure identification is properly formatted
        identification: identificationData ? {
          type: identificationData.type || null,
          social_number: identificationData.social_number || "",
          document_number: identificationData.document_number || ""
        } : {
          type: null,
          social_number: "",
          document_number: ""
        },
        // Ensure all required fields have proper defaults
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        whatsapp_number: profileData.whatsapp_number || "",
        date_of_birth: profileData.date_of_birth || "",
        place_of_birth: profileData.place_of_birth || "",
        nationality: profileData.nationality || "",
        gender: profileData.gender || "",
        address: profileData.address || "",
        city: profileData.city || "",
        postal_code: profileData.postal_code || "",
        country: profileData.country || "",
        iban: profileData.iban || ""
      };
      
      console.log("useParticipantProfile - Transformed profile data:", transformedData);
      
      return transformedData;
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
