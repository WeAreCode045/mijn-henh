
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
  // Extract the properties needed for each section
  const propertyId = property.object_id || "";
  const agentId = property.agent_id || "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pass only the props that PropertyIdSection expects */}
          <PropertyIdSection 
            objectId={propertyId}
            onSave={handleSaveObjectId}
            isDisabled={isReadOnly}
          />
          
          {/* Pass only the props that AgentSection expects */}
          <AgentSection 
            agentId={agentId}
            agentInfo={agentInfo}
            onSave={handleSaveAgent}
          />
        </CardContent>
      </Card>
      
      {!isReadOnly && onDelete && (
        <DangerZoneSection 
          onDelete={onDelete}
          propertyId={property.id}
        />
      )}
    </div>
  );
}
