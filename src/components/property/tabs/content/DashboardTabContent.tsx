
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

export interface DashboardTabContentProps {
  property: PropertyData;
  onDelete: () => Promise<void>;
  onSave: () => void;
  onWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => Promise<void>;
}

export function DashboardTabContent({
  property,
  onDelete,
  onSave,
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  return (
    <PropertyDashboardTab
      id={property.id}
      title={property.title}
      objectId={property.object_id}
      agentId={property.agent_id}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      agentInfo={property.agent ? { id: property.agent.id, name: property.agent.name } : null}
      isUpdating={false}
      onSave={onSave}
      onDelete={onDelete}
      handleSaveObjectId={async () => {}}
      handleSaveAgent={handleSaveAgent}
      handleGeneratePDF={() => {}}
      handleWebView={onWebView}
    />
  );
}
