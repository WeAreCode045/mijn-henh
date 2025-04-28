
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AgentSelectorProps {
  initialAgentId?: string;
  onAgentChange: (agentId: string) => Promise<void>;
}

export function AgentSelector({ initialAgentId, onAgentChange }: AgentSelectorProps) {
  const [agents, setAgents] = useState<{id: string, full_name: string}[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState(initialAgentId || "no-agent");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
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
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name')
          .or('role.eq.agent,role.eq.admin');
        
        if (error) throw error;
        
        if (data) {
          setAgents(data.map(agent => ({
            id: agent.id || "",
            full_name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent'
          })));
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
    // Safety check to ensure onAgentChange is defined and is a function
    if (typeof onAgentChange !== 'function') {
      console.error("Error: onAgentChange is not a function", onAgentChange);
      toast({
        title: "Error",
        description: "Cannot update agent - invalid handler",
        variant: "destructive",
      });
      return;
    }
    
    const finalAgentId = agentId === "no-agent" ? "" : agentId;
    
    try {
      setCurrentAgentId(agentId);
      await onAgentChange(finalAgentId);
      
      toast({
        title: "Success",
        description: "Agent updated successfully",
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
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="agent-select">Assigned Agent</Label>
      <Select 
        value={currentAgentId} 
        onValueChange={handleAgentChange}
        disabled={isLoadingAgents}
        defaultValue="no-agent"
      >
        <SelectTrigger id="agent-select" className="w-full">
          <SelectValue placeholder="Select an agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-agent">No agent assigned</SelectItem>
          {agents.map(agent => (
            <SelectItem 
              key={agent.id} 
              value={agent.id}
            >
              {agent.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
