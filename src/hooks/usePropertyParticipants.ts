
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyParticipant, ParticipantRole, ParticipantStatus } from "@/types/participant";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/lib/email";

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
            documents_signed: Array.isArray(participant.documents_signed) ? participant.documents_signed : [],
            role: participant.role as ParticipantRole, // Force type compatibility
            status: participant.status as ParticipantStatus // Force type compatibility
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
      email, 
      firstName, 
      lastName, 
      role, 
      propertyId 
    }: { 
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      propertyId: string;
    }) => {
      const { data, error } = await supabase
        .from("property_participants")
        .insert({
          property_id: propertyId,
          user_id: email,
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
    mutationFn: async ({ participantId }: { participantId: string; role: string }) => {
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

  // Add the missing resendInvite function
  const resendInvite = useMutation({
    mutationFn: async (participantId: string) => {
      try {
        // Get the participant data
        const { data: participant, error: participantError } = await supabase
          .from("property_participants")
          .select(`
            user_id,
            role,
            property_id
          `)
          .eq("id", participantId)
          .single();
        
        if (participantError) throw participantError;
        if (!participant) throw new Error("Participant not found");
        
        // Get user email from participants_profile
        const { data: profile, error: profileError } = await supabase
          .from("participants_profile")
          .select("email, first_name, last_name")
          .eq("id", participant.user_id)
          .single();
          
        if (profileError) throw profileError;
        
        // Get property details for the invitation
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('title')
          .eq('id', participant.property_id)
          .single();
          
        if (propertyError) throw propertyError;
        
        // Get agency settings
        const { data: agencySettings, error: settingsError } = await supabase
          .from('agency_settings')
          .select('resend_from_email, resend_from_name')
          .single();
          
        if (settingsError) {
          console.error("Error fetching agency settings:", settingsError);
        }
        
        // Send invitation email
        const siteUrl = window.location.origin;
        const inviteLink = `${siteUrl}/auth?redirect=/participant`;
        
        await sendEmail({
          to: profile.email,
          subject: `Reminder: You've been invited as a ${participant.role} for ${property.title || 'a property'}`,
          html: `
            <h1>Property Invitation Reminder</h1>
            <p>Hello ${profile.first_name || ''} ${profile.last_name || ''},</p>
            <p>This is a reminder that you have been invited to participate as a <strong>${participant.role}</strong> for ${property.title || 'a property'}.</p>
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
        
        return { success: true };
      } catch (error) {
        console.error("Error resending invitation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Invitation Resent",
        description: "The invitation has been resent successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to resend invitation: ${error.message}`,
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
    removeParticipant,
    resendInvite
  };
}
