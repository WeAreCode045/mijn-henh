
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AgentSelectorProps {
  initialAgentId?: string;
  onAgentChange: (agentId: string) => Promise<void>;
  isDisabled?: boolean;
}

export function AgentSelector({ initialAgentId, onAgentChange, isDisabled = false }: AgentSelectorProps) {
  const [agents, setAgents] = useState<{id: string, display_name: string}[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState(initialAgentId || "no-agent");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialAgentId !== undefined) {
      setCurrentAgentId(initialAgentId || "no-agent");
    }
  }, [initialAgentId]);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        // First get all users with agent or admin role
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id, role, email')
          .or('role.eq.agent,role.eq.admin');
        
        if (accountsError) {
          throw accountsError;
        }
        
        if (accountsData && accountsData.length > 0) {
          const agentIds = accountsData.map(account => account.user_id);
          
          // Then fetch their profiles from employer_profiles
          const { data, error } = await supabase
            .from('employer_profiles')
            .select('id, first_name, last_name')
            .in('id', agentIds);
          
          if (error) throw error;
          
          if (data) {
            setAgents(data.map(agent => ({
              id: agent.id || "",
              display_name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent'
            })));
          }
        } else {
          setAgents([]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error",
          description: "Failed to load agents",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [toast]);

  const handleAgentChange = async (agentId: string) => {
    try {
      setIsSaving(true);
      setCurrentAgentId(agentId);
      
      // Log exactly what we're passing to the handler
      console.log("AgentSelector: Calling onAgentChange with agent ID:", agentId === "no-agent" ? "" : agentId);
      
      await onAgentChange(agentId === "no-agent" ? "" : agentId);
      toast({
        title: "Success",
        description: "The assigned agent has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to update the property agent",
        variant: "destructive",
      });
      
      // Reset to previous agent ID on error
      setCurrentAgentId(initialAgentId || "no-agent");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="agent-select">Assign Agent</Label>
      <Select 
        value={currentAgentId} 
        onValueChange={handleAgentChange}
        disabled={isLoadingAgents || isSaving || isDisabled}
        defaultValue="no-agent"
      >
        <SelectTrigger id="agent-select" className="w-full">
          {isLoadingAgents ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Loading agents...</span>
            </div>
          ) : isSaving ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select an agent" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-agent">No agent assigned</SelectItem>
          {agents.map(agent => (
            <SelectItem 
              key={agent.id} 
              value={agent.id}
            >
              {agent.display_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
