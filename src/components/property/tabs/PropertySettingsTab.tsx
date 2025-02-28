
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
  if (!propertyId) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Property data is loading or not available.</p>
      </div>
    );
  }

  // Ensure we never pass empty strings to the child components
  const safeObjectId = objectId || "";
  const safeAgentId = agentId || "";
  const safeTemplateId = templateId || "default";

  return (
    <div className="space-y-6">
      <PropertyIdSection 
        objectId={safeObjectId} 
        onSave={onSaveObjectId}
        isUpdating={isUpdating}
      />
      
      <AgentSection 
        agentId={safeAgentId} 
        onSave={onSaveAgent}
        isUpdating={isUpdating}
      />
      
      <TemplateSection 
        templateId={safeTemplateId} 
        onSave={onSaveTemplate}
        isUpdating={isUpdating}
      />
      
      <DangerZoneSection onDelete={onDelete} />
    </div>
  );
}
