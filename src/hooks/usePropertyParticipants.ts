
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyParticipant, ParticipantInvite, ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';

export function usePropertyParticipants(propertyId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: participants,
    isLoading,
    error
  } = useQuery({
    queryKey: ['property-participants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];

      const { data, error } = await supabase
        .from('property_participants')
        .select(`
          *,
          user:profiles(id, email, role),
          participant_profile:participants_profile(*)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      // Transform the data with proper type handling
      return data.map(item => {
        // Make sure we handle potentially undefined data
        const userProfile = item.user || {};
        
        // Initialize participant profile as null
        let participantProfileData: ParticipantProfileData | null = null;
        
        // Check if participant_profile exists and is a proper object (not an error)
        if (
          item.participant_profile && 
          typeof item.participant_profile === 'object' && 
          !Array.isArray(item.participant_profile) &&
          !('error' in item.participant_profile)
        ) {
          // Now TypeScript knows this is safe
          participantProfileData = item.participant_profile as ParticipantProfileData;
        }
        
        // Determine name with proper null checks
        let fullName = 'Unknown';
        
        if (participantProfileData) {
          const firstName = participantProfileData.first_name || '';
          const lastName = participantProfileData.last_name || '';
          if (firstName && lastName) {
            fullName = `${firstName} ${lastName}`;
          }
        }
          
        // Return properly typed participant object
        return {
          id: item.id,
          property_id: item.property_id,
          user_id: item.user_id,
          role: item.role,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          documents_signed: item.documents_signed,
          webview_approved: item.webview_approved,
          user: {
            id: userProfile && typeof userProfile === 'object' && 'id' in userProfile ? 
                userProfile.id : item.user_id,
            full_name: fullName,
            email: userProfile && typeof userProfile === 'object' && 'email' in userProfile ? 
                   userProfile.email : 
                   (participantProfileData?.email || null),
            phone: participantProfileData?.phone || null,
            whatsapp_number: participantProfileData?.whatsapp_number || null,
            role: userProfile && typeof userProfile === 'object' && 'role' in userProfile ? 
                  userProfile.role : item.role
          },
          // Only include participant_profile if it's valid
          ...(participantProfileData ? { participant_profile: participantProfileData } : {})
        } as PropertyParticipant;
      });
    },
    enabled: !!propertyId,
  });

  const addParticipantMutation = useMutation({
    mutationFn: async (participant: ParticipantInvite) => {
      // First check if a user with this email exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', participant.email)
        .single();

      let userId;
      
      if (existingUsers) {
        // User exists, use their ID
        userId = existingUsers.id;
        
        // If the user exists but doesn't have the correct role, update it
        if (existingUsers.role !== participant.role) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: participant.role })
            .eq('id', existingUsers.id);
          
          if (updateError) {
            console.warn('Could not update existing user role:', updateError);
          }
        }
      } else {
        // Create a new user with this email and correct role
        const { data: authUser, error: signUpError } = await supabase.auth.signUp({
          email: participant.email,
          password: Math.random().toString(36).slice(-10), // Generate random password
          options: {
            data: {
              role: participant.role, // Explicitly set the correct role
            }
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw signUpError;
        }

        userId = authUser.user?.id;
        
        // Double-check the profile exists with the correct role
        if (userId) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ role: participant.role })
            .eq('id', userId);
            
          if (profileUpdateError) {
            console.warn('Could not ensure profile role:', profileUpdateError);
          }
        }
      }

      // Now add the participant
      const { data, error } = await supabase
        .from('property_participants')
        .insert({
          property_id: participant.propertyId,
          user_id: userId,
          role: participant.role,
        })
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('This user is already a participant for this property');
        }
        console.error('Error adding participant:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Participant added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['property-participants', propertyId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add participant',
        variant: 'destructive',
      });
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await supabase
        .from('property_participants')
        .delete()
        .eq('id', participantId);

      if (error) {
        console.error('Error removing participant:', error);
        throw error;
      }

      return participantId;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Participant removed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['property-participants', propertyId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove participant',
        variant: 'destructive',
      });
    },
  });

  const updateParticipantStatusMutation = useMutation({
    mutationFn: async ({ participantId, status }: { participantId: string; status: string }) => {
      const { data, error } = await supabase
        .from('property_participants')
        .update({ status })
        .eq('id', participantId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating participant status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Participant status updated',
      });
      queryClient.invalidateQueries({ queryKey: ['property-participants', propertyId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update participant status',
        variant: 'destructive',
      });
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'resend_participant_invite',
          participantId
        }
      });

      if (error) {
        console.error("Error sending invitation:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitation has been resent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['property-participants', propertyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    },
  });

  const { data: userParticipation } = useQuery({
    queryKey: ['user-participation', propertyId, user?.id],
    queryFn: async () => {
      if (!propertyId || !user?.id) return null;

      const { data, error } = await supabase
        .from('property_participants')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching user participation:', error);
        throw error;
      }

      return data as PropertyParticipant | null;
    },
    enabled: !!propertyId && !!user?.id,
  });

  return {
    participants,
    isLoading,
    error,
    addParticipant: addParticipantMutation.mutate,
    removeParticipant: removeParticipantMutation.mutate,
    updateParticipantStatus: updateParticipantStatusMutation.mutate,
    isParticipantSeller: userParticipation?.role === 'seller',
    isParticipantBuyer: userParticipation?.role === 'buyer',
    userParticipation,
    resendInvite: resendInviteMutation.mutate,
  };
}
