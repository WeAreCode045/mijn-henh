
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ParticipantProfileData } from '@/types/participant';
import { useToast } from '@/components/ui/use-toast';

export function useParticipants() {
  const [participants, setParticipants] = useState<ParticipantProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const { refetch } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
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
          setIsLoading(false);
          return [];
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
        const combinedData = profilesData?.map(profile => {
          const account = participantAccounts.find(acc => acc.user_id === profile.id);
          return {
            ...profile,
            role: account?.role || null,
            email: profile.email || account?.email || null
          };
        }) || [];
        
        console.log("Combined participant data:", combinedData);
        setParticipants(combinedData);
        setIsLoading(false);
        return combinedData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        console.error('Error fetching participants:', error);
        toast({
          title: "Error",
          description: "Failed to load participants",
          variant: "destructive",
        });
        setIsLoading(false);
        return [];
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
