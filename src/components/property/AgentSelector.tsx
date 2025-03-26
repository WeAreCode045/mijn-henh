
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentSelectorProps {
  agents: Array<{ id: string; full_name: string }>;
  selectedAgent: string;
  onAgentSelect: (agentId: string) => void;
}

export function AgentSelector({ agents, selectedAgent, onAgentSelect }: AgentSelectorProps) {
  // Handler to convert "none" to empty string if needed
  const handleAgentSelect = (value: string) => {
    onAgentSelect(value === "none" ? "" : value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedAgent || "none"}
          onValueChange={handleAgentSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No agent</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id || "agent_id"}>
                {agent.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
