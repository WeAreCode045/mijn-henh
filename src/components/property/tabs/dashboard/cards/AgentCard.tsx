
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  full_name: string;
}

interface AgentCardProps {
  agentId?: string;
  agentName?: string;
  onSaveAgent: (agentId: string) => void;
  isUpdating?: boolean;
}

export function AgentCard({ agentId, agentName, onSaveAgent, isUpdating = false }: AgentCardProps) {
  const [currentAgentId, setCurrentAgentId] = useState(agentId || "");
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
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

  // Update currentAgentId when the prop changes
  useEffect(() => {
    if (agentId !== undefined) {
      setCurrentAgentId(agentId);
    }
  }, [agentId]);

  const handleSaveAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    onSaveAgent(currentAgentId);
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
          >
            <SelectTrigger id="agent-select">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSaveAgent} disabled={isUpdating}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : "Assign Agent"}
        </Button>
      </CardContent>
    </Card>
  );
}
