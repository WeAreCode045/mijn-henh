
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
          .select('*')
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
        
        // Create a map of user ids
        const userIds = accountsData.map(account => account.user_id);
        
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
        const { data: accounts, error: accountsError2 } = await supabase
          .from("accounts")
          .select("id, user_id, email, display_name")
          .in("user_id", userIds);
          
        if (accountsError2) {
          console.error("Error fetching participant accounts:", accountsError2);
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
        const participantsMap = new Map();
        
        if (accountsData && Array.isArray(accountsData)) {
          accountsData.forEach(account => {
            if (account && !participantsMap.has(account.id)) {
              const profile = profileMap.get(account.id) || {};
              // Get email from the emailMap, profile, or fallback to empty string
              const userEmail = emailMap.get(account.id) || profile.email || '';
              
              participantsMap.set(account.id, {
                id: account.id,
                email: userEmail,
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
                properties: [], // Will be populated later
                avatar_url: null,
                full_name: account.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed Participant',
                bank_account_number: profile.iban || null // Use iban as bank_account_number for compatibility
              });
            }
          });
        }
        
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
