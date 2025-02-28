
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
  templateId,
  onSaveObjectId,
  onSaveAgent,
  onSaveTemplate,
  onDelete,
  isUpdating
}: PropertySettingsTabProps) {
  if (!propertyId) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Property data is loading or not available.</p>
      </div>
    );
  }

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
