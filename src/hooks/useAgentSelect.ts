
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
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'agent');
        
        if (!error && data) {
          setAgents(data);
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
