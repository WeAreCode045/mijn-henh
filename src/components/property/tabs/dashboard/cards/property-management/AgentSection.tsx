
import { AgentSelector } from "../../../../dashboard/components/AgentSelector";
import { useToast } from "@/hooks/use-toast";

interface AgentSectionProps {
  agentId?: string;
  handleSaveAgent: (agentId: string) => Promise<void>;
}

export function AgentSection({ agentId, handleSaveAgent }: AgentSectionProps) {
  const { toast } = useToast();

  const handleAgentChange = async (selectedAgentId: string) => {
    if (selectedAgentId === agentId) {
      console.log("Agent unchanged, skipping update");
      return;
    }
    
    console.log("Saving agent:", selectedAgentId);
    try {
      await handleSaveAgent(selectedAgentId);
      toast({
        description: "Agent updated successfully",
      });
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <AgentSelector 
        initialAgentId={agentId} 
        onAgentChange={handleAgentChange} 
      />
    </div>
  );
}
