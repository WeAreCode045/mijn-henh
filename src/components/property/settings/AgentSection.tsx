
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, Loader2 } from "lucide-react";
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Update currentAgentId when agentId prop changes
  useEffect(() => {
    setCurrentAgentId(agentId || "none");
  }, [agentId]);

  useEffect(() => {
    // Fetch agents
    const fetchAgents = async () => {
      try {
        // Get accounts first to filter by agent role
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id')
          .in('role', ['agent', 'admin']);
        
        if (accountsError) {
          console.error('Error fetching agent accounts:', accountsError);
          return;
        }

        if (accountsData && accountsData.length > 0) {
          const agentIds = accountsData.map(account => account.user_id);
          
          // Now get the profiles for these agent accounts
          const { data, error } = await supabase
            .from('employer_profiles')
            .select('id, first_name, last_name')
            .in('id', agentIds);
          
          if (!error && data) {
            const formattedAgents: Agent[] = data.map(profile => ({
              id: profile.id,
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed Agent'
            }));
            setAgents(formattedAgents);
          } else {
            console.error('Error fetching agent profiles:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    
    fetchAgents();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("AgentSection: Saving agent ID:", currentAgentId === "none" ? "" : currentAgentId);
      await onSave(currentAgentId === "none" ? "" : currentAgentId);
    } catch (error) {
      console.error("Error saving agent:", error);
    } finally {
      setIsSaving(false);
    }
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
            disabled={isDisabled || isSaving}
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
                  value={agent.id}
                >
                  {agent.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isUpdating || isDisabled || isSaving}
        >
          {(isUpdating || isSaving) ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Assign Agent
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
