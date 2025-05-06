
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
      
      try {
        // Step 1: Check if the user already exists in the system
        const { data: existingUser, error: userCheckError } = await supabase
          .from('accounts')
          .select('user_id')
          .eq('email', participant.email)
          .limit(1);
        
        if (userCheckError) {
          console.error('Error checking existing user:', userCheckError);
          throw new Error(`Failed to check existing user: ${userCheckError.message}`);
        }
        
        // User must exist to be added as a participant
        if (!existingUser || existingUser.length === 0) {
          throw new Error('User does not exist. Please create the user first in the admin panel.');
        }
        
        const userId = existingUser[0].user_id;
        console.log(`Using existing user ID: ${userId} for email: ${participant.email}`);
        
        // Step 2: Check if the participant already exists for this property
        const { data: existingParticipant, error: checkError } = await supabase
          .from('accounts')
          .select('id')
          .eq('email', participant.email)
          .eq('property_id', participant.propertyId)
          .limit(1);
        
        if (checkError) {
          console.error('Error checking existing participant:', checkError);
          throw new Error(`Failed to check existing participant: ${checkError.message}`);
        }
        
        // If participant already exists for this property, return error
        if (existingParticipant && existingParticipant.length > 0) {
          throw new Error('This email is already a participant for this property');
        }
        
        // Step 3: Add the participant to the property
        console.log(`Adding participant with role ${participant.role} to property ${participant.propertyId}`);
        
        const { data: newParticipant, error: insertError } = await supabase
          .from('accounts')
          .insert({
            property_id: participant.propertyId,
            user_id: userId,
            role: participant.role,
            status: 'pending',
            email: participant.email
          })
          .select();
        
        if (insertError) {
          console.error('Error adding participant to property:', insertError);
          throw new Error(`Failed to add participant: ${insertError.message}`);
        }
        
        if (!newParticipant || newParticipant.length === 0) {
          throw new Error('No data returned after adding participant');
        }
        
        console.log('Participant successfully added:', newParticipant[0]);
        
        // Step 4: Update participant profile with first and last name if needed
        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('participants_profile')
            .select('id, first_name, last_name')
            .eq('id', userId)
            .single();
          
          // If profile exists but first/last name are different, update them
          if (existingProfile && 
              (existingProfile.first_name !== participant.firstName || 
               existingProfile.last_name !== participant.lastName)) {
            
            console.log('Updating participant profile with new name:', {
              first_name: participant.firstName,
              last_name: participant.lastName
            });
            
            const { error: updateError } = await supabase
              .from('participants_profile')
              .update({
                first_name: participant.firstName,
                last_name: participant.lastName
              })
              .eq('id', userId);
            
            if (updateError) {
              console.error('Error updating participant profile:', updateError);
              // Continue anyway - this is not critical
            }
          }
        } catch (profileError) {
          console.error('Error handling participant profile:', profileError);
          // Continue anyway - this is not critical
        }
        
        // Return the participant data
        return {
          ...newParticipant[0],
          firstName: participant.firstName,
          lastName: participant.lastName
        };
      } catch (error) {
        console.error('Error in participant invitation process:', error);
        throw error;
      }
    },
    onSuccess: async (result) => {
      console.log('Participant added successfully, sending invitation email:', result);
      
      try {
        // Get property details
        const { data: property } = await supabase
          .from('properties')
          .select('title')
          .eq('id', propertyId)
          .single();
        
        // Get agency settings
        const { data: agencySettings } = await supabase
          .from('agency_settings')
          .select('resend_from_email, resend_from_name')
          .single();
        
        const siteUrl = window.location.origin;
        const inviteLink = `${siteUrl}/auth?redirect=/participant`;
        
        // Import email utility
        const { sendEmail } = await import('@/lib/email');
        
        // Send invitation email (without login details since user already exists)
        await sendEmail({
          to: result.email,
          subject: `You've been invited as a ${result.role} for ${property?.title || 'a property'}`,
          html: `
            <h1>Property Invitation</h1>
            <p>Hello ${result.firstName || ''} ${result.lastName || ''},</p>
            <p>You have been invited to participate as a <strong>${result.role}</strong> for ${property?.title || 'a property'}.</p>
            <p>You can access this property using your existing account credentials.</p>
            <p><a href="${inviteLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Property Portal</a></p>
            <p style="margin-top: 20px; color: #666;">
              If the button above doesn't work, copy and paste this link into your browser:
              <br>
              <span style="word-break: break-all; font-family: monospace;">${inviteLink}</span>
            </p>
          `,
          from: agencySettings?.resend_from_email,
          fromName: agencySettings?.resend_from_name
        });
        
        console.log('Invitation email sent successfully');
      } catch (error) {
        console.error('Error sending invitation email:', error);
        // Don't throw here, we still want to show success for adding the participant
      }
      
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
