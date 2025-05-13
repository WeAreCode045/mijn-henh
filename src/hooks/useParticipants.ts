
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantProfileData } from "@/types/participant";

export function useParticipants() {
  const { data: participants, isLoading, error, refetch } = useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      console.log("Fetching participants in useParticipants hook");
      try {
        // First get all accounts with participant type
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select(`
            id,
            user_id,
            type,
            display_name,
            email,
            role
          `)
          .eq('type', 'participant');

        if (accountsError) {
          console.error("Error fetching participant accounts:", accountsError);
          throw accountsError;
        }
        
        console.log("Participant accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No accounts found with participant type");
          return [];
        }
        
        // Get the participant profiles
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
            date_of_birth,
            place_of_birth,
            identification,
            nationality,
            gender,
            iban,
            role,
            created_at,
            updated_at
          `)
          .in('id', accountsData.map(account => account.id));

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.error("Error fetching participant profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Participant profiles from supabase:", profiles);

        // Create a map of id to profile for quick lookups
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Find properties linked to these participants
        const { data: propertiesBuyer, error: buyerError } = await supabase
          .from('properties')
          .select('id, buyer_id')
          .in('buyer_id', accountsData.map(a => a.id));
          
        if (buyerError && buyerError.code !== 'PGRST116') {
          console.error("Error fetching buyer properties:", buyerError);
        }
        
        const { data: propertiesSeller, error: sellerError } = await supabase
          .from('properties')
          .select('id, seller_id')
          .in('seller_id', accountsData.map(a => a.id));
          
        if (sellerError && sellerError.code !== 'PGRST116') {
          console.error("Error fetching seller properties:", sellerError);
        }
        
        // Create a map of account id to properties
        const propertyMap = new Map();
        if (propertiesBuyer) {
          propertiesBuyer.forEach(prop => {
            if (prop.buyer_id) {
              if (!propertyMap.has(prop.buyer_id)) {
                propertyMap.set(prop.buyer_id, []);
              }
              propertyMap.get(prop.buyer_id).push(prop.id);
            }
          });
        }
        
        if (propertiesSeller) {
          propertiesSeller.forEach(prop => {
            if (prop.seller_id) {
              if (!propertyMap.has(prop.seller_id)) {
                propertyMap.set(prop.seller_id, []);
              }
              propertyMap.get(prop.seller_id).push(prop.id);
            }
          });
        }
        
        // Create a map to store the participant data with unique id
        const participantsMap = new Map();
        
        // Process each account to create participant data
        accountsData.forEach(account => {
          if (!participantsMap.has(account.id)) {
            const profile = profileMap.get(account.id) || {};
            
            // Use account email if profile doesn't have one
            const email = profile.email || account.email || '';
            
            participantsMap.set(account.id, {
              id: account.id,
              email: email,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              phone: profile.phone || '',
              whatsapp_number: profile.whatsapp_number || '',
              address: profile.address || '',
              city: profile.city || '',
              postal_code: profile.postal_code || '',
              country: profile.country || '',
              date_of_birth: profile.date_of_birth || null,
              place_of_birth: profile.place_of_birth || null,
              identification: profile.identification || null,
              nationality: profile.nationality || null,
              gender: profile.gender || null,
              iban: profile.iban || null,
              role: profile.role || account.role || 'buyer',
              created_at: profile.created_at || '',
              updated_at: profile.updated_at || '',
              properties: propertyMap.get(account.id) || [],
              avatar_url: null,
              full_name: account.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed Participant'
            });
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
    error,
    refetch
  };
}
