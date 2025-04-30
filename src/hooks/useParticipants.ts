
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function useParticipants() {
  const [participants, setParticipants] = useState<ParticipantProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching participants...");
        
        // Get all accounts with buyer or seller roles
        const { data: participantAccounts, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id, role, email')
          .in('role', ['buyer', 'seller']);
        
        if (accountsError) {
          throw new Error(accountsError.message);
        }
        
        console.log("Found participant accounts:", participantAccounts);
        
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
        
        console.log("Found participant profiles:", profilesData);
        
        // Combine account and profile data
        const combinedData = profilesData.map(profile => {
          const account = participantAccounts.find(acc => acc.user_id === profile.id);
          return {
            ...profile,
            role: account?.role || null,
            email: profile.email || account?.email || null
          };
        });
        
        console.log("Combined participant data:", combinedData);
        setParticipants(combinedData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        console.error('Error fetching participants:', error);
        toast({
          title: "Error",
          description: "Failed to load participants",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParticipants();
  }, [toast]);

  return {
    participants,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      try {
        const { data: participantAccounts } = await supabase
          .from('accounts')
          .select('user_id, role, email')
          .in('role', ['buyer', 'seller']);
        
        if (!participantAccounts?.length) {
          setParticipants([]);
          setIsLoading(false);
          return;
        }
        
        const userIds = participantAccounts.map(account => account.user_id);
        
        const { data: profilesData } = await supabase
          .from('participants_profile')
          .select('*')
          .in('id', userIds);
        
        const combinedData = (profilesData || []).map(profile => {
          const account = participantAccounts.find(acc => acc.user_id === profile.id);
          return {
            ...profile,
            role: account?.role || null,
            email: profile.email || account?.email || null
          };
        });
        
        setParticipants(combinedData || []);
      } catch (err) {
        console.error('Error refreshing participants:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };
}
