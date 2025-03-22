
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
          .from('profiles')
          .select('id, full_name, role')
          .or('role.eq.agent,role.eq.admin');
        
        if (error) throw error;
        
        if (data) {
          setAgents(data.map(agent => ({
            id: agent.id,
            full_name: agent.full_name || 'Unnamed Agent'
          })));
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentChange = async (agentId: string) => {
    const finalAgentId = agentId === "no-agent" ? "" : agentId;
    try {
      setCurrentAgentId(agentId);
      await onAgentChange(finalAgentId);
      
      toast({
        title: "Agent updated",
        description: "The property agent has been updated",
      });
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to update the property agent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="agent-select">Assigned Agent</Label>
      <Select 
        value={currentAgentId} 
        onValueChange={handleAgentChange}
        disabled={isLoadingAgents}
      >
        <SelectTrigger id="agent-select" className="w-full">
          <SelectValue placeholder="Select an agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-agent">No agent assigned</SelectItem>
          {agents.map(agent => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
