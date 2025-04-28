
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

interface Agent {
  id: string;
  full_name: string;
}

export function useAgentSelect(initialAgentId?: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(initialAgentId || "");
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchAgents = async () => {
      if (isAdmin) {
        // First get all users with agent or admin role
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id, role')
          .or('role.eq.agent,role.eq.admin');
        
        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
          return;
        }
        
        if (accountsData && accountsData.length > 0) {
          const agentIds = accountsData.map(account => account.user_id);
          
          // Then fetch their profiles from employer_profiles
          const { data, error } = await supabase
            .from('employer_profiles')
            .select('id, first_name, last_name')
            .in('id', agentIds);
          
          if (!error && data) {
            setAgents(data.map(agent => ({
              id: agent.id,
              full_name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent'
            })));
          } else if (error) {
            console.error('Error fetching employer profiles:', error);
          }
        }
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
    setSelectedAgent
  };
}
