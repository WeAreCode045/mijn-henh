
import { useState } from "react";
import { AgentSelector } from "../../../../dashboard/components/AgentSelector";
import { useToast } from "@/hooks/use-toast";

interface AgentSectionProps {
  agentId?: string;
  handleSaveAgent: (agentId: string) => Promise<void>;
}

export function AgentSection({ agentId, handleSaveAgent }: AgentSectionProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleAgentChange = async (selectedAgentId: string) => {
    if (selectedAgentId === agentId) {
      console.log("AgentSection: Agent unchanged, skipping update");
      return;
    }
    
    console.log("AgentSection: Saving agent:", selectedAgentId);
    try {
      setIsSaving(true);
      await handleSaveAgent(selectedAgentId);
      toast({
        description: "Agent updated successfully",
      });
      console.log("AgentSection: Agent save completed successfully");
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <AgentSelector 
        initialAgentId={agentId} 
        onAgentChange={handleAgentChange} 
        isDisabled={isSaving}
      />
    </div>
  );
}
