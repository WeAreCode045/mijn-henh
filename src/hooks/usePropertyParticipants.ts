
import { useState } from 'react';
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

      console.log(`Fetching participants for property: ${propertyId}`);

      // Query from users_roles table instead of property_participants
      const { data, error } = await supabase
        .from('users_roles')
        .select(`
          *,
          user:auth.users(id, email),
          participant_profile:participants_profile(*)
        `)
        .eq('property_id', propertyId)
        .in('role', ['buyer', 'seller'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      console.log("Fetched participants data:", data);

      return data.map(item => {
        const userProfile = item.user || {};
        
        let participantProfileData: ParticipantProfileData | null = null;
        
        if (
          item.participant_profile && 
          typeof item.participant_profile === 'object' && 
          !Array.isArray(item.participant_profile) &&
          !('error' in item.participant_profile)
        ) {
          participantProfileData = item.participant_profile as ParticipantProfileData;
        }
        
        let fullName = 'Unknown';
        if (participantProfileData) {
          const firstName = participantProfileData.first_name || '';
          const lastName = participantProfileData.last_name || '';
          if (firstName && lastName) {
            fullName = `${firstName} ${lastName}`;
          } else if (firstName) {
            fullName = firstName;
          } else if (lastName) {
            fullName = lastName;
          }
        }
          
        return {
          id: item.id,
          property_id: item.property_id,
          user_id: item.user_id,
          role: item.role,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          documents_signed: [],
          webview_approved: false,
          user: {
            id: userProfile && typeof userProfile === 'object' && 'id' in userProfile ? 
                userProfile.id : item.user_id,
            full_name: fullName,
            email: userProfile && typeof userProfile === 'object' && 'email' in userProfile ? 
                   userProfile.email : 
                   (participantProfileData?.email || null),
            phone: participantProfileData?.phone || null,
            whatsapp_number: participantProfileData?.whatsapp_number || null,
            role: item.role
          },
          ...(participantProfileData ? { participant_profile: participantProfileData } : {})
        } as PropertyParticipant;
      });
    },
    enabled: !!propertyId,
  });

  const addParticipantMutation = useMutation({
    mutationFn: async (participant: ParticipantInvite) => {
      console.log("Starting participant invitation process for:", participant);
      
      const { data: existingUsers } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', participant.email);

      console.log("Existing users check:", existingUsers);
      
      let userId;
      
      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        console.log(`User already exists with ID: ${userId}`);
      } else {
        console.log(`Creating new user for email: ${participant.email}`);
        
        const { data: authUser, error: signUpError } = await supabase.auth.signUp({
          email: participant.email,
          password: Math.random().toString(36).slice(-10), // Generate random password
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw signUpError;
        }

        console.log("New user created:", authUser);
        userId = authUser.user?.id;
      }

      console.log(`Adding participant with role ${participant.role} to property ${participant.propertyId}`);
      
      // Insert into users_roles table instead of property_participants
      const { data, error } = await supabase
        .from('users_roles')
        .insert({
          property_id: participant.propertyId,
          user_id: userId,
          role: participant.role,
          status: 'pending'
        })
        .select('*');

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('This user is already a participant for this property');
        }
        console.error('Error adding participant:', error);
        throw error;
      }

      console.log("Participant successfully added:", data);
      return data[0];
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
      // Delete from users_roles instead of property_participants
      const { error } = await supabase
        .from('users_roles')
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
      // Update users_roles instead of property_participants
      const { data, error } = await supabase
        .from('users_roles')
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

      // Query users_roles instead of property_participants
      const { data, error } = await supabase
        .from('users_roles')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .in('role', ['buyer', 'seller'])
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
