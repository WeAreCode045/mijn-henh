
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyParticipant, ParticipantInvite, ParticipantProfileData, ParticipantRole, ParticipantStatus } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';

export function usePropertyParticipants(propertyId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: participants,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property-participants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];

      console.log(`Fetching participants for property: ${propertyId}`);

      // Get participants from the accounts table where property_id matches and role is buyer or seller
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          id,
          user_id,
          property_id,
          role,
          status,
          email,
          created_at,
          updated_at
        `)
        .in('role', ['buyer', 'seller'])
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      console.log("Fetched participants data:", data);

      // For each participant, fetch their profile data
      const participantsWithProfiles: PropertyParticipant[] = [];

      for (const participant of data) {
        // Get participant profile
        const { data: profileData } = await supabase
          .from('participants_profile')
          .select('*')
          .eq('id', participant.user_id)
          .single();

        // Create a full name from profile data
        const fullName = profileData?.first_name && profileData?.last_name ? 
          `${profileData.first_name} ${profileData.last_name}` : 
          (profileData?.first_name || profileData?.last_name || participant.email?.split('@')[0] || 'Unknown');
          
        participantsWithProfiles.push({
          id: participant.id,
          property_id: participant.property_id,
          user_id: participant.user_id,
          role: participant.role as ParticipantRole,
          status: participant.status as ParticipantStatus,
          created_at: participant.created_at,
          updated_at: participant.updated_at,
          email: participant.email,
          documents_signed: [], // Default empty array
          webview_approved: false, // Default to false
          user: {
            id: participant.user_id,
            full_name: fullName,
            email: participant.email || ''
          },
          participant_profile: profileData || null
        });
      }

      return participantsWithProfiles;
    },
    enabled: !!propertyId,
  });

  const addParticipantMutation = useMutation({
    mutationFn: async (participant: ParticipantInvite) => {
      console.log("Starting participant invitation process for:", participant);
      
      let userId: string;
      let existingUser = false;
      
      // First check if the user already exists
      const { data: existingUserData, error: existingUserError } = await supabase
        .from('accounts')
        .select('user_id')
        .eq('email', participant.email)
        .limit(1);
        
      if (existingUserError) {
        console.error('Error checking existing user:', existingUserError);
        throw existingUserError;
      }
      
      if (existingUserData && existingUserData.length > 0) {
        // User already exists
        userId = existingUserData[0].user_id;
        existingUser = true;
        console.log(`User already exists with ID: ${userId}`);
      } else {
        console.log(`Creating new user for email: ${participant.email}`);
        
        // Use the provided temporary password or generate a random one
        const password = participant.temporaryPassword || Math.random().toString(36).slice(-10);
        
        // Create the user account
        const { data: authUser, error: signUpError } = await supabase.auth.signUp({
          email: participant.email,
          password: password,
          options: {
            data: {
              first_name: participant.firstName,
              last_name: participant.lastName,
              role: participant.role
            }
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw signUpError;
        }

        console.log("New user created:", authUser);
        if (!authUser.user?.id) {
          throw new Error('Failed to create user');
        }
        userId = authUser.user.id;
        
        // Create participant profile with first and last name
        const { error: profileError } = await supabase
          .from('participants_profile')
          .insert({
            id: userId,
            first_name: participant.firstName,
            last_name: participant.lastName,
            email: participant.email
            // Note: role is stored in the accounts table, not in participants_profile
          });
          
        if (profileError) {
          console.error('Error creating participant profile:', profileError);
          // Don't throw here, we can continue without the profile
        }
      }

      console.log(`Adding participant with role ${participant.role} to property ${participant.propertyId}`);
      
      // Insert into accounts table
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          property_id: participant.propertyId,
          user_id: userId,
          role: participant.role,
          status: 'pending',
          email: participant.email
        })
        .select();

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
      // Delete from accounts
      const { error } = await supabase
        .from('accounts')
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
      // Update accounts status
      const { data, error } = await supabase
        .from('accounts')
        .update({ status })
        .eq('id', participantId)
        .select()
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

      // Get from accounts table
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .in('role', ['buyer', 'seller'])
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user participation:', error);
        throw error;
      }

      if (!data) return null;
      
      // Add the required fields for PropertyParticipant
      const fullParticipant: PropertyParticipant = {
        ...data,
        role: data.role as ParticipantRole,
        status: data.status as ParticipantStatus,
        documents_signed: [],
        webview_approved: false,
        user: {
          id: data.user_id,
          full_name: user.email?.split('@')[0] || 'User',
          email: data.email || user.email || ''
        },
        participant_profile: null
      };

      return fullParticipant;
    },
    enabled: !!propertyId && !!user?.id,
  });

  return {
    participants,
    isLoading,
    error,
    refetch,
    addParticipant: addParticipantMutation.mutate,
    removeParticipant: removeParticipantMutation.mutate,
    updateParticipantStatus: updateParticipantStatusMutation.mutate,
    isParticipantSeller: userParticipation?.role === 'seller',
    isParticipantBuyer: userParticipation?.role === 'buyer',
    userParticipation,
    resendInvite: resendInviteMutation.mutate,
  };
}
