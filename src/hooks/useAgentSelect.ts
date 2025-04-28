
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
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name')
          .or('role.eq.agent,role.eq.admin'); // Include both agent and admin roles
        
        if (!error && data) {
          setAgents(data.map(agent => ({
            id: agent.id,
            full_name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent'
          })));
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
