
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';

export function useParticipants() {
  const [participants, setParticipants] = useState<ParticipantProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setIsLoading(true);
        
        // Get all accounts with buyer or seller roles
        const { data: participantAccounts, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id, role, email')
          .in('role', ['buyer', 'seller']);
        
        if (accountsError) {
          throw new Error(accountsError.message);
        }
        
        if (!participantAccounts.length) {
          setParticipants([]);
          return;
        }
        
        // Get all user profiles for these accounts
        const userIds = participantAccounts.map(account => account.user_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('participants_profile')
          .select('*')
          .in('id', userIds);
        
        if (profilesError) {
          throw new Error(profilesError.message);
        }
        
        // Combine account and profile data
        const combinedData = profilesData.map(profile => {
          const account = participantAccounts.find(acc => acc.user_id === profile.id);
          return {
            ...profile,
            role: account?.role || null,
            email: profile.email || account?.email || null
          };
        });
        
        setParticipants(combinedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching participants:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParticipants();
  }, []);

  return {
    participants,
    isLoading,
    error
  };
}
