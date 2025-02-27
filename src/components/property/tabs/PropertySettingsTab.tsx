
import { PropertyIdSection } from "../settings/PropertyIdSection";
import { AgentSection } from "../settings/AgentSection";
import { TemplateSection } from "../settings/TemplateSection";
import { DangerZoneSection } from "../settings/DangerZoneSection";

interface PropertySettingsTabProps {
  propertyId: string;
  objectId: string | undefined;
  agentId: string | undefined;
  templateId: string | undefined;
  onSaveObjectId: (objectId: string) => void;
  onSaveAgent: (agentId: string) => void;
  onSaveTemplate: (templateId: string) => void;
  onDelete: () => Promise<void>;
  isUpdating: boolean;
}

export function PropertySettingsTab({
  propertyId,
  objectId,
  agentId,
  templateId,
  onSaveObjectId,
  onSaveAgent,
  onSaveTemplate,
  onDelete,
  isUpdating
}: PropertySettingsTabProps) {
  return (
    <div className="space-y-6">
      <PropertyIdSection 
        objectId={objectId || ""} 
        onSave={onSaveObjectId}
        isUpdating={isUpdating}
      />
      
      <AgentSection 
        agentId={agentId || ""} 
        onSave={onSaveAgent}
        isUpdating={isUpdating}
      />
      
      <TemplateSection 
        templateId={templateId || "default"} 
        onSave={onSaveTemplate}
        isUpdating={isUpdating}
      />
      
      <DangerZoneSection onDelete={onDelete} />
    </div>
  );
}
