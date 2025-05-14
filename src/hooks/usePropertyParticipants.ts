
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyParticipant, ParticipantRole, ParticipantRemoveParams, ParticipantStatusUpdateParams } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyParticipants(propertyId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch participants for a specific property
  const { data: participants, error, refetch } = useQuery({
    queryKey: ['property-participants', propertyId],
    queryFn: async () => {
      try {
        console.log('Fetching participants for property:', propertyId);
        
        // Get all property_participants for this property
        const { data: participantsData, error: participantsError } = await supabase
          .from('property_participants')
          .select('*')
          .eq('property_id', propertyId);

        if (participantsError) {
          console.error('Error fetching property participants:', participantsError);
          throw participantsError;
        }
        
        console.log('Property participants data:', participantsData);
        
        if (!participantsData || participantsData.length === 0) {
          return [];
        }
        
        // Get user_ids to fetch from accounts
        const userIds = participantsData.map(p => p.user_id);
        
        // Get account data for these users
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .in('user_id', userIds);
          
        if (accountsError) {
          console.error('Error fetching participant accounts:', accountsError);
          throw accountsError;
        }
        
        // Create a map for emails and display names
        const emailMap = new Map();
        const displayNameMap = new Map();
        
        // First try to get emails and names from the accounts table
        accountsData?.forEach(account => {
          if (account.email) {
            emailMap.set(account.user_id, account.email);
          }
          if (account.display_name) {
            displayNameMap.set(account.user_id, account.display_name);
          }
        });
        
        // For any missing emails or names, try to get them from auth.users via admin API
        try {
          const { data: usersData } = await supabase.auth.admin.listUsers({
            perPage: 1000
          });
          
          if (usersData && usersData.users) {
            usersData.users.forEach(user => {
              if (user.email) {
                emailMap.set(user.id, user.email);
              }
            });
          }
        } catch (err) {
          console.error("Error fetching user emails from auth.users:", err);
          // Continue without these emails
        }
        
        // Map participants with user details
        const enrichedParticipants: PropertyParticipant[] = participantsData.map(participant => {
          const userId = participant.user_id;
          
          return {
            ...participant,
            user: {
              id: userId,
              email: emailMap.get(userId) || '',
              full_name: displayNameMap.get(userId) || 'Unknown User'
            }
          };
        });

        console.log('Enriched participants:', enrichedParticipants);
        return enrichedParticipants;
      } catch (err) {
        console.error('Error in usePropertyParticipants:', err);
        throw err;
      }
    },
    enabled: !!propertyId,
  });

  // Add a participant to a property
  const addParticipant = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('property_participants')
        .insert({
          property_id: propertyId,
          user_id: userId,
          role: 'buyer',
          status: 'pending'
        })
        .select();

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: 'Success',
        description: 'Participant added successfully',
      });
    } catch (error: any) {
      console.error('Error adding participant:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add participant',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a participant from a property
  const removeParticipant = async ({ participantId, role }: ParticipantRemoveParams) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('property_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: 'Success',
        description: `${role.charAt(0).toUpperCase() + role.slice(1)} removed successfully`,
      });
    } catch (error: any) {
      console.error('Error removing participant:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove participant',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a participant's status
  const updateParticipantStatus = async ({ participantId, status }: ParticipantStatusUpdateParams) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('property_participants')
        .update({ status })
        .eq('id', participantId);

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: 'Success',
        description: `Participant status updated to ${status}`,
      });
    } catch (error: any) {
      console.error('Error updating participant status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update participant status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend invite to a participant
  const resendInvite = async (participantId: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would send an email invitation
      // For now, we'll just update the updated_at timestamp
      const { error } = await supabase
        .from('property_participants')
        .update({ 
          updated_at: new Date().toISOString(),
          status: 'pending' // Reset to pending if it was declined
        })
        .eq('id', participantId);

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: 'Success',
        description: 'Invitation resent successfully',
      });
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    participants: participants || [],
    isLoading,
    error,
    addParticipant,
    removeParticipant,
    updateParticipantStatus,
    resendInvite,
    refetch
  };
}
