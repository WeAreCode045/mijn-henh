
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  full_name: string;
}

interface AgentSectionProps {
  agentId: string;
  onSave: (agentId: string) => Promise<void>;
  isUpdating?: boolean;
  isDisabled?: boolean;
}

export function AgentSection({ 
  agentId, 
  onSave, 
  isUpdating = false,
  isDisabled = false
}: AgentSectionProps) {
  const [currentAgentId, setCurrentAgentId] = useState(agentId || "none");
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Fetch agents
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'agent');
      
      if (!error && data) {
        setAgents(data);
      }
    };
    
    fetchAgents();
  }, []);

  const handleSave = () => {
    onSave(currentAgentId === "none" ? "" : currentAgentId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Assigned Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-select">Select Agent</Label>
          <Select 
            value={currentAgentId} 
            onValueChange={setCurrentAgentId}
            disabled={isDisabled}
            defaultValue="none"
          >
            <SelectTrigger id="agent-select">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {agents.map((agent) => (
                <SelectItem 
                  key={agent.id} 
                  value={agent.id || `agent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}
                >
                  {agent.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSave} disabled={isUpdating || isDisabled}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : "Assign Agent"}
        </Button>
      </CardContent>
    </Card>
  );
}
