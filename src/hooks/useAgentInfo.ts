
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAgentInfo(agentId: string | undefined) {
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchAgentInfo = async () => {
      if (!agentId) {
        setAgentInfo(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', agentId)
        .single();
      
      if (data) {
        setAgentInfo({ id: data.id, name: data.full_name });
      } else {
        setAgentInfo(null);
      }
    };

    fetchAgentInfo();
  }, [agentId]);

  return { agentInfo, setAgentInfo };
}
