
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantProfileData, ParticipantRole } from "@/types/participant";

// Type for the identification document
interface Identification {
  type?: 'passport' | 'id_card' | 'drivers_license' | string;
  number?: string;
  issue_date?: string;
  expiry_date?: string;
  issued_by?: string;
  [key: string]: unknown; // Allow additional properties
}

// Type for the raw identification data from Supabase
type RawIdentification = string | number | boolean | null | Identification | { [key: string]: RawIdentification } | RawIdentification[];

type ParticipantAccount = {
  id: string;
  user_id: string;
  email?: string;
  role?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
};

type ParticipantProfile = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  identification?: RawIdentification;
  nationality?: string | null;
  gender?: string | null;
  iban?: string | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ParticipantData = Omit<ParticipantProfileData, 'identification'> & {
  identification: Identification | null;
};

export function useParticipants() {
  const { data: participants = [], isLoading, error, refetch } = useQuery<ParticipantData[]>({
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
          throw profilesError;
        }
        
        // Create a map for quick lookup
        const profileMap = new Map<string, ParticipantProfile>();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Map the data with profiles
        return accountsData.map(account => {
          const profile = profileMap.get(account.id);
          
          // Initialize with default values if profile is undefined
          if (!profile) {
            return {
              id: account.id,
              email: account.email || null,
              first_name: null,
              last_name: null,
              phone: null,
              whatsapp_number: null,
              address: null,
              city: null,
              postal_code: null,
              country: null,
              date_of_birth: null,
              place_of_birth: null,
              identification: null,
              nationality: null,
              gender: null,
              iban: null,
              role: (account.role as ParticipantRole) || 'buyer',
              created_at: account.created_at,
              updated_at: account.updated_at,
              full_name: account.display_name || 'Unnamed Participant',
            };
          }
          
          // Parse identification from RawIdentification to Identification
          let identification: Identification | null = null;
          if (profile.identification) {
            try {
              // Handle different types of identification data
              const rawId = profile.identification;
              if (typeof rawId === 'string') {
                // If it's a string, try to parse it as JSON
                identification = JSON.parse(rawId) as Identification;
              } else if (rawId && typeof rawId === 'object' && !Array.isArray(rawId)) {
                // If it's already an object, use it directly
                identification = rawId as Identification;
              }
              // For other types (number, boolean, array), leave as null
            } catch (e) {
              console.error('Error parsing identification:', e);
              identification = null;
            }
          }
          
          return {
            id: account.id,
            email: account.email || profile.email || null,
            first_name: profile.first_name ?? null,
            last_name: profile.last_name ?? null,
            phone: profile.phone ?? null,
            whatsapp_number: profile.whatsapp_number ?? null,
            address: profile.address ?? null,
            city: profile.city ?? null,
            postal_code: profile.postal_code ?? null,
            country: profile.country ?? null,
            date_of_birth: profile.date_of_birth ?? null,
            place_of_birth: profile.place_of_birth ?? null,
            identification,
            nationality: profile.nationality ?? null,
            gender: profile.gender ?? null,
            iban: profile.iban ?? null,
            role: (profile.role || account.role || 'buyer') as ParticipantRole,
            created_at: profile.created_at ?? new Date().toISOString(),
            updated_at: profile.updated_at ?? '',
            full_name: account.display_name || 
              [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || 
              'Unnamed Participant',
          };
        });
      } catch (error) {
        console.error("Error in useParticipants:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    participants,
    isLoading,
    error,
    refetch
  };
}
