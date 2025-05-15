
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
        
        // Create a map for emails
        const emailMap = new Map();
        const userIdToAccountIdMap = new Map();
        
        // Track user_id to account_id mapping
        if (accountsData) {
          accountsData.forEach((account: any) => {
            if (account && account.user_id) {
              userIdToAccountIdMap.set(account.user_id, account.id);
            }
          });
        }
        
        // For any missing emails, try to get them from auth.users via admin API
        const userIds = accountsData
          .filter((account: any) => account && account.user_id)
          .map((account: any) => account.user_id);
          
        if (userIds.length > 0) {
          try {
            const { data: usersData } = await supabase.auth.admin.listUsers({
              perPage: 1000
            });
            
            if (usersData && usersData.users) {
              usersData.users.forEach((user: any) => {
                if (user && user.id && user.email) {
                  // Map user id to email
                  emailMap.set(user.id, user.email);
                  
                  // Also map account id to email if we have the mapping
                  const accountId = userIdToAccountIdMap.get(user.id);
                  if (accountId) {
                    emailMap.set(accountId, user.email);
                  }
                }
              });
            }
          } catch (err) {
            console.error("Error fetching user emails from auth.users:", err);
            // Continue without these emails
          }
        }
        
        // Get the participant profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("participants_profile")
          .select(`*`)
          .in('id', accountsData.map((account: any) => account.id));

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.error("Error fetching participant profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Participant profiles from supabase:", profiles);

        // Create a map of id to profile for quick lookups
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach((profile: any) => {
            if (profile && profile.id) {
              profileMap.set(profile.id, profile);
            }
          });
        }
        
        // Create a map to store the participant data with unique id
        const participantsMap = new Map();
        
        // Process each account to create participant data
        if (accountsData) {
          accountsData.forEach((account: any) => {
            if (account && account.id && !participantsMap.has(account.id)) {
              const profile = profileMap.get(account.id) || {};
              // Get email from the emailMap, profile, or fallback to empty string
              const userEmail = emailMap.get(account.id) || emailMap.get(account.user_id) || profile.email || '';
              
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
                identification: profile.identification || { 
                  type: null, 
                  document_number: null, 
                  social_number: null 
                },
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
