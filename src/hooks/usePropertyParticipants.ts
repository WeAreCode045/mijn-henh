
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
      console.log("Starting simplified participant invitation process for:", participant);
      
      // Generate a secure password for the invitation email
      const temporaryPassword = participant.temporaryPassword || 
        Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-2);
      
      try {
        // Step 1: Check if the email already exists in any property
        const { data: existingParticipant, error: checkError } = await supabase
          .from('accounts')
          .select('id, user_id, property_id, role')
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
        
        // Step 2: Check if the email exists in any other property
        const { data: existingEmail, error: emailCheckError } = await supabase
          .from('accounts')
          .select('user_id')
          .eq('email', participant.email)
          .limit(1);
        
        let userId: string;
        let isNewUser = true;
        
        if (emailCheckError) {
          console.error('Error checking existing email:', emailCheckError);
          // Continue anyway with a new user ID
        }
        
        // If email exists in another property, use the same user_id
        if (existingEmail && existingEmail.length > 0) {
          userId = existingEmail[0].user_id;
          isNewUser = false;
          console.log(`Using existing user ID: ${userId} for email: ${participant.email}`);
        } else {
          // Generate a new UUID for the user
          userId = crypto.randomUUID();
          console.log(`Generated new user ID: ${userId} for email: ${participant.email}`);
          
          // Step 3: Create participant profile for new users
          try {
            console.log('Creating participant profile with data:', {
              id: userId,
              first_name: participant.firstName,
              last_name: participant.lastName,
              email: participant.email
            });
            
            const { error: profileError } = await supabase
              .from('participants_profile')
              .insert({
                id: userId,
                first_name: participant.firstName,
                last_name: participant.lastName,
                email: participant.email
              });
            
            if (profileError) {
              console.error('Error creating participant profile:', profileError);
              console.error('Profile error details:', profileError.details, profileError.hint);
              // Continue anyway - we'll just have a user without a profile
            } else {
              console.log('Participant profile created successfully');
            }
          } catch (profileError) {
            console.error('Exception creating participant profile:', profileError);
            // Continue without the profile
          }
        }
        
        // Step 4: Add the participant to the property
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
        
        // Return the participant data with the temporary password for email sending
        return {
          ...newParticipant[0],
          temporaryPassword: isNewUser ? temporaryPassword : undefined
        };
      } catch (error) {
        console.error('Error in participant invitation process:', error);
        throw error;
      }
    },
    onSuccess: async (result) => {
      console.log('Participant added successfully, sending invitation email:', result);
      
      try {
        // Only send email if we have a temporary password (new user)
        if (result.temporaryPassword) {
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
          
          // Send invitation email with login details
          await sendEmail({
            to: result.email,
            subject: `You've been invited as a ${result.role} for ${property?.title || 'a property'}`,
            html: `
              <h1>Property Invitation</h1>
              <p>Hello,</p>
              <p>You have been invited to participate as a <strong>${result.role}</strong> for ${property?.title || 'a property'}.</p>
              <p>We've created an account for you with the following details:</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Email:</strong> ${result.email}</p>
                <p><strong>Temporary Password:</strong> ${result.temporaryPassword}</p>
              </div>
              <p>Please login using these credentials. You'll be prompted to change your password after your first login.</p>
              <p><a href="${inviteLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Property Portal</a></p>
              <p style="margin-top: 20px; color: #666;">
                If the button above doesn't work, copy and paste this link into your browser:
                <br>
                <span style="word-break: break-all; font-family: monospace;">${inviteLink}</span>
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #888;">
                For security reasons, please change your password immediately after logging in.
              </p>
            `,
            from: agencySettings?.resend_from_email,
            fromName: agencySettings?.resend_from_name
          });
          
          console.log('Invitation email sent successfully');
        } else {
          console.log('User already exists, no need to send login details');
        }
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
