
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantProfileData } from "@/types/participant";

export function useParticipants() {
  const { data: participants, isLoading, error } = useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      console.log("Fetching participants in useParticipants hook");
      try {
        // First get all accounts with buyer or seller roles
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select(`
            id,
            user_id,
            role,
            email,
            property_id
          `)
          .in('role', ['buyer', 'seller']);

        if (accountsError) {
          console.error("Error fetching participant accounts:", accountsError);
          throw accountsError;
        }
        
        console.log("Participant accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No accounts found with buyer or seller roles");
          return [];
        }
        
        // Extract unique user IDs from accounts (avoid duplicates if a user is in multiple properties)
        const userIds = [...new Set(accountsData.map(account => account.user_id))];
        
        // Get the user profiles from participants_profile
        const { data: profiles, error: profilesError } = await supabase
          .from("participants_profile")
          .select(`
            id,
            email,
            first_name,
            last_name,
            phone,
            whatsapp_number,
            address,
            city,
            postal_code,
            country,
            created_at,
            updated_at
          `)
          .in('id', userIds);

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.error("Error fetching participant profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Participant profiles from supabase:", profiles);

        // Create a map of user_id to profile for quick lookups
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Create a map to store the participant data with unique user_id
        const participantsMap = new Map();
        
        // Process each account to create participant data
        accountsData.forEach(account => {
          if (!participantsMap.has(account.user_id)) {
            const profile = profileMap.get(account.user_id) || {};
            
            // Use account email if profile doesn't have one
            const email = profile.email || account.email || '';
            
            participantsMap.set(account.user_id, {
              id: account.user_id,
              email: email,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              phone: profile.phone || '',
              whatsapp_number: profile.whatsapp_number || '',
              address: profile.address || '',
              city: profile.city || '',
              postal_code: profile.postal_code || '',
              country: profile.country || '',
              role: account.role,  // Explicitly add the role from the account
              created_at: profile.created_at || '',
              updated_at: profile.updated_at || '',
              properties: [account.property_id].filter(Boolean), // Add property_id if it exists
              avatar_url: null  // Add default avatar_url
            });
          } else {
            // If the user already exists in our map, just add the property to their properties array
            const participant = participantsMap.get(account.user_id);
            if (account.property_id && !participant.properties.includes(account.property_id)) {
              participant.properties.push(account.property_id);
            }
          }
        });
        
        // Convert the map to an array of participant profiles
        const participantProfiles: ParticipantProfileData[] = Array.from(participantsMap.values());
        
        console.log("Transformed participants:", participantProfiles);
        return participantProfiles;
      } catch (err) {
        console.error("Error in useParticipants query function:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    participants: participants || [],
    isLoading,
    error
  };
}
