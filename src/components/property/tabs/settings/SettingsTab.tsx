
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyIdSection } from "../../settings/PropertyIdSection";
import { AgentSection } from "../../settings/AgentSection";
import { DangerZoneSection } from "../../settings/DangerZoneSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsTabProps {
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

export function SettingsTab({
  property,
  agentInfo,
  onDelete,
  onSave,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  isUpdating,
  isReadOnly = false
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PropertyIdSection 
            property={property} 
            handleSaveObjectId={handleSaveObjectId}
            isDisabled={isReadOnly}
          />
          
          <AgentSection 
            property={property}
            agentInfo={agentInfo}
            handleSaveAgent={handleSaveAgent}
          />
        </CardContent>
      </Card>
      
      {!isReadOnly && (
        <DangerZoneSection 
          property={property}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
