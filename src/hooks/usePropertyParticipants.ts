
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyParticipant } from "@/types/property/PropertyTypes";
import { ParticipantProfileData } from "@/types/participant";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

export function usePropertyParticipants(propertyId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: participants, isLoading, error, refetch } = useQuery({
    queryKey: ["propertyParticipants", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      try {
        // First fetch participants from property_participants table
        const { data, error } = await supabase
          .from("property_participants")
          .select("*")
          .eq("property_id", propertyId);
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return [];
        }
        
        // Create a map of user ids
        const userIds = data.map(participant => participant.user_id);
        
        // Fetch participant profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("participants_profile")
          .select("*")
          .in("id", userIds);
          
        if (profilesError) {
          console.error("Error fetching participant profiles:", profilesError);
        }
        
        // Create a map for quick lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Get emails from accounts table as backup
        const { data: accounts, error: accountsError } = await supabase
          .from("accounts")
          .select("id, user_id, email, display_name")
          .in("user_id", userIds);
          
        if (accountsError) {
          console.error("Error fetching participant accounts:", accountsError);
        }
        
        // Create a map for quick lookup
        const emailMap = new Map();
        if (accounts && Array.isArray(accounts)) {
          accounts.forEach(account => {
            if (account && account.email) {
              emailMap.set(account.id, account.email);
              emailMap.set(account.user_id, account.email);
            }
          });
        }
        
        // Map the data with profiles
        const participantsWithProfiles: PropertyParticipant[] = data.map(participant => {
          const profile = profileMap.get(participant.user_id) || {};
          const email = profile.email || emailMap.get(participant.user_id) || '';
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed Participant';
          
          return {
            ...participant,
            user: {
              id: participant.user_id,
              email,
              full_name: fullName
            },
            // Ensure documents_signed is always an array of strings
            documents_signed: Array.isArray(participant.documents_signed) ? participant.documents_signed : [] 
          };
        });
        
        return participantsWithProfiles;
      } catch (error) {
        console.error("Error fetching property participants:", error);
        throw error;
      }
    },
    enabled: !!propertyId
  });

  const addParticipant = useMutation({
    mutationFn: async ({ 
      userId, 
      role, 
      propertyId 
    }: { 
      userId: string;
      role: string;
      propertyId: string;
    }) => {
      const { data, error } = await supabase
        .from("property_participants")
        .insert({
          property_id: propertyId,
          user_id: userId,
          role
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Participant added to property"
      });
      queryClient.invalidateQueries({ queryKey: ["propertyParticipants", propertyId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add participant: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateParticipantStatus = useMutation({
    mutationFn: async ({ 
      participantId, 
      status 
    }: { 
      participantId: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("property_participants")
        .update({
          status
        })
        .eq("id", participantId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Participant status updated"
      });
      queryClient.invalidateQueries({ queryKey: ["propertyParticipants", propertyId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update participant status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const removeParticipant = useMutation({
    mutationFn: async (participantId: string) => {
      const { data, error } = await supabase
        .from("property_participants")
        .delete()
        .eq("id", participantId);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Participant removed from property"
      });
      queryClient.invalidateQueries({ queryKey: ["propertyParticipants", propertyId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to remove participant: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    participants: participants || [],
    isLoading,
    error,
    refetch,
    addParticipant,
    updateParticipantStatus,
    removeParticipant
  };
}
