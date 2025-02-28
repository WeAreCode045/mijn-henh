
import { PropertySettingsTab } from "../PropertySettingsTab";

interface SettingsTabContentProps {
  propertyId: string;
  objectId?: string;
  agentId?: string;
  templateId?: string;
  onSaveObjectId: (objectId: string) => void;
  onSaveAgent: (agentId: string) => void;
  onSaveTemplate: (templateId: string) => void;
  onDelete: () => Promise<void>;
  isUpdating: boolean;
}

export function SettingsTabContent({
  propertyId,
  objectId,
  agentId,
  templateId,
  onSaveObjectId,
  onSaveAgent,
  onSaveTemplate,
  onDelete,
  isUpdating,
}: SettingsTabContentProps) {
  return (
    <PropertySettingsTab
      propertyId={propertyId}
      objectId={objectId}
      agentId={agentId}
      templateId={templateId}
      onSaveObjectId={onSaveObjectId}
      onSaveAgent={onSaveAgent}
      onSaveTemplate={onSaveTemplate}
      onDelete={onDelete}
      isUpdating={isUpdating}
    />
  );
}
