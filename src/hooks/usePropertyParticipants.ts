import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  created_at?: string;
}

export interface UsePropertyParticipantsReturn {
  participants: PropertyParticipant[];
  isLoading: boolean;
  error: Error | null;
  addParticipant: (userId: string) => Promise<void>;
  removeParticipant: (participantId: string) => Promise<void>;
}

// Fix the email handling in the usePropertyParticipants hook
export function usePropertyParticipants(propertyId: string) {
  const [participants, setParticipants] = useState<PropertyParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchParticipants = async () => {
    try {
      if (!propertyId) {
        console.log('No property ID provided');
        return [];
      }

      const { data: participantsData, error: participantsError } = await supabase
        .from('property_participants')
        .select('*')
        .eq('property_id', propertyId);

      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
        throw participantsError;
      }

      if (!participantsData || participantsData.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(participantsData.map(p => p.user_id))];

      // Get accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .in('user_id', userIds);

      if (accountsError) {
        console.error('Error fetching accounts:', accountsError);
        throw accountsError;
      }

      // Get emails for these accounts
      const emailMap = new Map();
      
      // First try to get emails from the accounts table directly
      if (accountsData) {
        accountsData.forEach(account => {
          if (account.email) {
            emailMap.set(account.id, account.email);
            emailMap.set(account.user_id, account.email);
          }
        });
      }
      
      // For any missing emails, try to get them from auth.users via admin API
      const missingUserIds = userIds.filter(id => !emailMap.has(id));
      
      if (missingUserIds.length > 0) {
        try {
          const { data: usersData } = await supabase.auth.admin.listUsers({
            perPage: 1000
          });
          
          if (usersData && usersData.users) {
            usersData.users.forEach(user => {
              if (missingUserIds.includes(user.id) && user.email) {
                emailMap.set(user.id, user.email);
                
                const matchingAccount = accountsData?.find(acc => acc.user_id === user.id);
                if (matchingAccount) {
                  emailMap.set(matchingAccount.id, user.email);
                }
              }
            });
          }
        } catch (err) {
          console.error("Error fetching user emails from auth.users:", err);
          // Continue without these emails
        }
      }

      // Fetch participant profiles
      const { data: participantProfilesData, error: profilesError } = await supabase
        .from('participants_profile')
        .select('*')
        .in('id', accountsData?.map(acc => acc.id) || []);

      if (profilesError && profilesError.code !== 'PGRST116') {
        console.error('Error fetching participant profiles:', profilesError);
        throw profilesError;
      }

      const participantsList = participantsData.map(participant => {
        const account = accountsData?.find(acc => acc.user_id === participant.user_id) || {};
        const profile = participantProfilesData?.find(
          prof => prof.id === account.id
        ) || {};
        
        // Use emailMap for reliable email access
        const userEmail = emailMap.get(participant.user_id) || 
                         emailMap.get(account.id) ||
                         profile.email ||
                         '';
        
        return {
          id: participant.id,
          user_id: participant.user_id,
          email: userEmail,
          property_id: participant.property_id,
          created_at: participant.created_at,
        };
      });
      
      return participantsList;
    } catch (error) {
      console.error('Error in fetchParticipants:', error);
      throw error;
    }
  };

  const addParticipant = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('property_participants')
        .insert([{ property_id: propertyId, user_id: userId }]);

      if (error) {
        console.error("Error adding participant:", error);
        setError(error);
        toast({
          title: "Error",
          description: "Failed to add participant",
          variant: "destructive",
        });
      } else {
        setParticipants(await fetchParticipants());
        toast({
          title: "Success",
          description: "Participant added successfully",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeParticipant = async (participantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('property_participants')
        .delete()
        .eq('id', participantId);

      if (error) {
        console.error("Error removing participant:", error);
        setError(error);
        toast({
          title: "Error",
          description: "Failed to remove participant",
          variant: "destructive",
        });
      } else {
        setParticipants(await fetchParticipants());
        toast({
          title: "Success",
          description: "Participant removed successfully",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    participants,
    isLoading,
    error,
    addParticipant,
    removeParticipant,
  };
}
