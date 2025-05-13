
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

      // Check if property has participants as seller or buyer
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('seller_id, buyer_id')
        .eq('id', propertyId)
        .single();
        
      if (propertyError) {
        console.error('Error fetching property:', propertyError);
        throw propertyError;
      }
      
      const participantIds: string[] = [];
      if (property.seller_id) participantIds.push(property.seller_id);
      if (property.buyer_id) participantIds.push(property.buyer_id);
      
      if (participantIds.length === 0) {
        return [];
      }

      // Get the accounts info
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .in('id', participantIds)
        .eq('type', 'participant');

      if (accountsError) {
        console.error('Error fetching participant accounts:', accountsError);
        throw accountsError;
      }

      console.log("Fetched participant accounts:", accounts);

      if (!accounts || accounts.length === 0) {
        return [];
      }

      // For each participant, fetch their profile data
      const participantsWithProfiles: PropertyParticipant[] = [];

      for (const account of accounts) {
        // Get participant profile
        const { data: profileData } = await supabase
          .from('participants_profile')
          .select('*')
          .eq('id', account.id)
          .single();

        // Create a participant object
        const isSellerParticipant = property.seller_id === account.id;
        const role = isSellerParticipant ? 'seller' as ParticipantRole : 'buyer' as ParticipantRole;
          
        participantsWithProfiles.push({
          id: account.id,
          property_id: propertyId,
          user_id: account.user_id,
          role: role,
          status: account.status as ParticipantStatus,
          created_at: account.created_at,
          updated_at: account.updated_at,
          email: account.email,
          documents_signed: [], // Default empty array
          webview_approved: false, // Default to false
          user: {
            id: account.user_id,
            full_name: account.display_name || `Unknown ${role}`,
            email: account.email || ''
          },
          participant_profile: profileData as ParticipantProfileData || null
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
        // Step 1: Create auth user if doesn't exist
        let userId: string;
        
        // Check if the user already exists by email
        const { data: existingUser, error: userCheckError } = await supabase
          .from('accounts')
          .select('id, user_id')
          .eq('email', participant.email)
          .limit(1);
        
        if (userCheckError) {
          console.error('Error checking existing user:', userCheckError);
          throw new Error(`Failed to check existing user: ${userCheckError.message}`);
        }
        
        let accountId: string;
        
        // If user exists, use their id
        if (existingUser && existingUser.length > 0) {
          accountId = existingUser[0].id;
          userId = existingUser[0].user_id;
          console.log(`Using existing account ID: ${accountId} for email: ${participant.email}`);
        } else {
          // Create a new user in auth
          const password = Math.random().toString(36).slice(-8); // Generate random password
          
          // Create user using auth.admin API
          const { data: authData, error: authError } = await supabase.functions.invoke('create-user', {
            body: {
              email: participant.email,
              password,
              firstName: participant.firstName,
              lastName: participant.lastName
            }
          });
          
          if (authError || !authData) {
            console.error('Error creating auth user:', authError || 'No data returned');
            throw new Error(`Failed to create user: ${authError?.message || 'Unknown error'}`);
          }
          
          userId = authData.userId;
          
          // Create account
          const { data: newAccount, error: accountError } = await supabase
            .from('accounts')
            .insert({
              user_id: userId,
              email: participant.email,
              type: 'participant',
              role: participant.role,
              status: 'pending',
              display_name: `${participant.firstName} ${participant.lastName}`.trim()
            })
            .select('id')
            .single();
            
          if (accountError) {
            console.error('Error creating account:', accountError);
            throw new Error(`Failed to create account: ${accountError.message}`);
          }
          
          accountId = newAccount.id;
          
          // Create participant profile
          const { error: profileError } = await supabase
            .from('participants_profile')
            .insert({
              id: accountId,
              email: participant.email,
              first_name: participant.firstName,
              last_name: participant.lastName,
              role: participant.role
            });
            
          if (profileError) {
            console.error('Error creating participant profile:', profileError);
            throw new Error(`Failed to create profile: ${profileError.message}`);
          }
        }
        
        // Step 2: Check if the participant is already linked to this property
        const { data: property } = await supabase
          .from('properties')
          .select('seller_id, buyer_id')
          .eq('id', participant.propertyId)
          .single();
          
        if (participant.role === 'seller' && property.seller_id === accountId) {
          throw new Error('This seller is already linked to this property');
        }
        
        if (participant.role === 'buyer' && property.buyer_id === accountId) {
          throw new Error('This buyer is already linked to this property');
        }
        
        // Step 3: Update the property with the participant
        const updateData: any = {};
        if (participant.role === 'seller') {
          updateData.seller_id = accountId;
        } else {
          updateData.buyer_id = accountId;
        }
        
        const { error: updateError } = await supabase
          .from('properties')
          .update(updateData)
          .eq('id', participant.propertyId);
          
        if (updateError) {
          console.error('Error updating property with participant:', updateError);
          throw new Error(`Failed to link participant to property: ${updateError.message}`);
        }
        
        // Return the participant data
        return {
          id: accountId,
          role: participant.role,
          email: participant.email,
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
        
        // Send invitation email
        await sendEmail({
          to: result.email,
          subject: `You've been invited as a ${result.role} for ${property?.title || 'a property'}`,
          html: `
            <h1>Property Invitation</h1>
            <p>Hello ${result.firstName || ''} ${result.lastName || ''},</p>
            <p>You have been invited to participate as a <strong>${result.role}</strong> for ${property?.title || 'a property'}.</p>
            <p>You can access this property using your account credentials.</p>
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
    mutationFn: async (participantData: { participantId: string; role: ParticipantRole }) => {
      // Update property to remove reference to this participant
      const updateData: any = {};
      if (participantData.role === 'seller') {
        updateData.seller_id = null;
      } else {
        updateData.buyer_id = null;
      }
      
      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId);

      if (error) {
        console.error('Error removing participant:', error);
        throw error;
      }

      return participantData.participantId;
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
      // Update account status
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

  // Check if current user is a participant in this property
  const { data: userParticipation } = useQuery({
    queryKey: ['user-participation', propertyId, user?.id],
    queryFn: async () => {
      if (!propertyId || !user?.id) return null;

      // First get the account ID for this user
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'participant')
        .single();
        
      if (accountError) {
        console.error('Error fetching user account:', accountError);
        return null;
      }
      
      if (!accountData) return null;
      
      // Now check if this account is linked to the property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('seller_id, buyer_id')
        .eq('id', propertyId)
        .single();
        
      if (propertyError) {
        console.error('Error fetching property:', propertyError);
        return null;
      }
      
      // Check if the account is either seller or buyer
      if (property.seller_id === accountData.id) {
        const { data: account } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', accountData.id)
          .single();
          
        if (!account) return null;
        
        // Add the required fields for PropertyParticipant
        const fullParticipant = {
          id: account.id,
          user_id: account.user_id,
          property_id: propertyId,
          role: 'seller' as ParticipantRole,
          status: account.status as ParticipantStatus,
          created_at: account.created_at,
          updated_at: account.updated_at,
          documents_signed: [],
          webview_approved: false,
          user: {
            id: account.user_id,
            full_name: account.display_name || 'User',
            email: account.email || ''
          },
          participant_profile: null
        } as PropertyParticipant;

        return fullParticipant;
      } 
      else if (property.buyer_id === accountData.id) {
        const { data: account } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', accountData.id)
          .single();
          
        if (!account) return null;
        
        // Add the required fields for PropertyParticipant
        const fullParticipant = {
          id: account.id,
          user_id: account.user_id,
          property_id: propertyId,
          role: 'buyer' as ParticipantRole,
          status: account.status as ParticipantStatus,
          created_at: account.created_at,
          updated_at: account.updated_at,
          documents_signed: [],
          webview_approved: false,
          user: {
            id: account.user_id,
            full_name: account.display_name || 'User',
            email: account.email || ''
          },
          participant_profile: null
        } as PropertyParticipant;

        return fullParticipant;
      }

      return null;
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
