
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgentSelectorProps {
  initialAgentId?: string;
  onAgentChange: (agentId: string | null) => Promise<void>;
  isDisabled?: boolean;
}

export function AgentSelector({ initialAgentId, onAgentChange, isDisabled = false }: AgentSelectorProps) {
  const [agents, setAgents] = useState<{id: string, display_name: string}[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<string>(initialAgentId || "no-agent");
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
        // Get accounts with employee type and agent/admin role
        const { data, error } = await supabase
          .from('accounts')
          .select('id, display_name, type, role')
          .eq('type', 'employee')
          .in('role', ['agent', 'admin']);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Create a list of agents with their names
          const agentsList = data.map(account => ({
            id: account.id,
            display_name: account.display_name || `Agent ${account.id.substring(0, 8)}`
          }));
          
          setAgents(agentsList);
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
    console.log("AgentSelector: Selected agent ID:", agentId);
    
    if (!onAgentChange || typeof onAgentChange !== 'function') {
      console.error("Error: onAgentChange is not a function", onAgentChange);
      toast({
        title: "Error",
        description: "Cannot update agent - invalid handler",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      setCurrentAgentId(agentId);
      
      // Convert "no-agent" to null which will be properly handled in the database
      // Using null directly instead of empty string to ensure it's properly processed
      const finalAgentId = agentId === "no-agent" ? null : agentId;
      
      console.log("AgentSelector: Calling onAgentChange with agent ID:", finalAgentId);
      await onAgentChange(finalAgentId);
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
