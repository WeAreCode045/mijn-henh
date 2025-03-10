
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/integrations/supabase/clientManager';

export function useAgentInfo(agentId: string | undefined) {
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgentInfo = async () => {
      if (!agentId) {
        setAgentInfo(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get the best available client
        const supabase = await getSupabaseClient();
        if (!supabase) {
          throw new Error('No Supabase client available');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', agentId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setAgentInfo({ id: data.id, name: data.full_name });
        } else {
          setAgentInfo(null);
        }
      } catch (err) {
        console.error('Error fetching agent info:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setAgentInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentInfo();
  }, [agentId]);

  return { agentInfo, setAgentInfo, isLoading, error };
}
