
import React from 'react';
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "@/components/property/tabs/dashboard/PropertyDashboardTab";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onWebView?: (e?: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => void;
  handleSaveObjectId?: (objectId: string) => void;
  handleSaveTemplate?: (templateId: string) => void;
  handleGeneratePDF?: (e: React.MouseEvent) => void;
  isUpdating?: boolean;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function DashboardTabContent({
  property,
  onDelete,
  onWebView,
  handleSaveAgent,
  handleSaveObjectId,
  handleSaveTemplate,
  handleGeneratePDF,
  isUpdating = false,
  agentInfo,
  templateInfo
}: DashboardTabContentProps) {
  return (
    <PropertyDashboardTab
      id={property.id}
      title={property.title || 'Untitled Property'}
      propertyData={property}
      objectId={property.object_id}
      agentId={property.agent_id}
      templateId={property.template_id}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      onDelete={onDelete}
      onWebView={onWebView}
      onGeneratePDF={handleGeneratePDF}
      onSaveAgent={handleSaveAgent}
      onSaveObjectId={handleSaveObjectId}
      onSaveTemplate={handleSaveTemplate}
      isUpdating={isUpdating}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
    />
  );
}
