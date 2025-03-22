
import React from "react";
import { PropertyData } from "@/types/property";
import { SettingsTab } from "../settings/SettingsTab";

interface SettingsTabContentProps {
  property: PropertyData;
  agentInfo?: { id: string; name: string } | null;
  onDelete?: () => Promise<void>;
  onSave?: () => void;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveTemplate: (templateId: string) => Promise<void>;
  isUpdating: boolean;
  isReadOnly?: boolean;
}

export function SettingsTabContent({ 
  property, 
  agentInfo,
  onDelete,
  onSave,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  isUpdating,
  isReadOnly = false
}: SettingsTabContentProps) {
  return (
    <SettingsTab 
      property={property}
      agentInfo={agentInfo}
      onDelete={onDelete}
      onSave={onSave}
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={handleSaveAgent}
      handleSaveTemplate={handleSaveTemplate}
      isUpdating={isUpdating}
      isReadOnly={isReadOnly}
    />
  );
}
