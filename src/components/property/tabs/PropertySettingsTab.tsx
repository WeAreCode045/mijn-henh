
import { PropertyIdSection } from "../settings/PropertyIdSection";
import { AgentSection } from "../settings/AgentSection";
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
  onSaveObjectId,
  onSaveAgent,
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
      
      {/* Template section removed temporarily */}
      
      <DangerZoneSection onDelete={onDelete} />
    </div>
  );
}
