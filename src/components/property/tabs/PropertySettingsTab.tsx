
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertyIdSection } from "../settings/PropertyIdSection";
import { AgentSection } from "../settings/AgentSection";
import { TemplateSection } from "../settings/TemplateSection";
import { DangerZoneSection } from "../settings/DangerZoneSection";

interface PropertySettingsTabProps {
  id: string;
  objectId?: string;
  agentId?: string;
  selectedTemplateId?: string;
  onDelete: () => Promise<void>;
  onSaveSettings: (objectId: string, agentId: string, templateId: string) => Promise<void>;
  isUpdating?: boolean;
}

export function PropertySettingsTab({
  id,
  objectId = "",
  agentId = "",
  selectedTemplateId = "default",
  onDelete,
  onSaveSettings,
  isUpdating = false,
}: PropertySettingsTabProps) {
  const [currentObjectId, setCurrentObjectId] = useState(objectId);
  const [currentAgentId, setCurrentAgentId] = useState(agentId);
  const [currentTemplateId, setCurrentTemplateId] = useState(selectedTemplateId);
  const { toast } = useToast();

  // Update state when props change
  useEffect(() => {
    setCurrentObjectId(objectId);
    setCurrentAgentId(agentId);
    setCurrentTemplateId(selectedTemplateId);
  }, [objectId, agentId, selectedTemplateId]);

  const handleSaveObjectId = async (newObjectId: string) => {
    setCurrentObjectId(newObjectId);
    try {
      await onSaveSettings(newObjectId, currentAgentId, currentTemplateId);
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
    }
  };

  const handleSaveAgent = async (newAgentId: string) => {
    setCurrentAgentId(newAgentId);
    try {
      await onSaveSettings(currentObjectId, newAgentId, currentTemplateId);
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
    }
  };

  const handleSaveTemplate = async (newTemplateId: string) => {
    setCurrentTemplateId(newTemplateId);
    try {
      await onSaveSettings(currentObjectId, currentAgentId, newTemplateId);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PropertyIdSection 
        objectId={currentObjectId} 
        onSave={handleSaveObjectId}
        isUpdating={isUpdating}
      />
      
      <AgentSection 
        agentId={currentAgentId} 
        onSave={handleSaveAgent}
        isUpdating={isUpdating}
      />
      
      <TemplateSection 
        templateId={currentTemplateId} 
        onSave={handleSaveTemplate}
        isUpdating={isUpdating}
      />
      
      <DangerZoneSection onDelete={onDelete} />
    </div>
  );
}
