
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete: () => Promise<void>;
  onSave: () => void;
  onWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleGeneratePDF: () => void;
}

export function DashboardTabContent({
  property,
  onDelete,
  onSave,
  onWebView,
  handleSaveAgent,
  handleSaveObjectId,
  handleGeneratePDF
}: DashboardTabContentProps) {
  // Provide a fallback for handleSaveAgent if it's undefined
  const safeHandleSaveAgent = typeof handleSaveAgent === 'function' 
    ? handleSaveAgent 
    : async () => { console.warn("handleSaveAgent not provided"); };

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
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={safeHandleSaveAgent}
      handleGeneratePDF={handleGeneratePDF}
      handleWebView={onWebView}
    />
  );
}
