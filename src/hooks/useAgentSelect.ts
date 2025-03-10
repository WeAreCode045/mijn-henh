
import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/integrations/supabase/clientManager";
import { useAuth } from "@/providers/AuthProvider";

interface Agent {
  id: string;
  full_name: string;
}

export function useAgentSelect(initialAgentId?: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(initialAgentId || "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchAgents = async () => {
      if (isAdmin) {
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
            .or('role.eq.agent,role.eq.admin'); // Include both agent and admin roles
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setAgents(data);
          }
        } catch (err) {
          console.error('Error fetching agents:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, [isAdmin]);

  useEffect(() => {
    if (initialAgentId) {
      setSelectedAgent(initialAgentId);
    }
  }, [initialAgentId]);

  return {
    agents,
    selectedAgent,
    setSelectedAgent,
    isLoading,
    error
  };
}
