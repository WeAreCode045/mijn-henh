
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: string;
  full_name: string;
}

export function useAgentSelect(initialAgentId?: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(initialAgentId || "");
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgents = async () => {
      if (isAdmin) {
        setIsLoading(true);
        try {
          // First get all users with agent or admin role
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('user_id, role')
            .or('role.eq.agent,role.eq.admin');
          
          if (accountsError) {
            console.error('Error fetching accounts:', accountsError);
            toast({
              title: "Error",
              description: "Failed to load agents",
              variant: "destructive",
            });
            return;
          }
          
          if (accountsData && accountsData.length > 0) {
            const agentIds = accountsData.map(account => account.user_id);
            
            // Then fetch their profiles from employer_profiles
            const { data, error } = await supabase
              .from('employer_profiles')
              .select('id, first_name, last_name')
              .in('id', agentIds);
            
            if (error) {
              console.error('Error fetching employer profiles:', error);
              toast({
                title: "Error",
                description: "Failed to load agent profiles",
                variant: "destructive",
              });
              return;
            }
            
            if (data) {
              setAgents(data.map(agent => ({
                id: agent.id,
                full_name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent'
              })));
            }
          }
        } catch (error) {
          console.error('Unexpected error in useAgentSelect:', error);
          toast({
            title: "Error",
            description: "Failed to load agents",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAgents();
  }, [isAdmin, toast]);

  useEffect(() => {
    if (initialAgentId) {
      setSelectedAgent(initialAgentId);
    }
  }, [initialAgentId]);

  return {
    agents,
    selectedAgent,
    setSelectedAgent,
    isLoading
  };
}
