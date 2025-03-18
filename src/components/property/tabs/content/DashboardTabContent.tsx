
import React from 'react';
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "@/components/property/tabs/PropertyDashboardTab";

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
  // Safe defaults for callback functions
  const safeOnDelete = onDelete || (() => Promise.resolve());
  const safeHandleSaveAgent = handleSaveAgent || (() => {});
  const safeHandleSaveObjectId = handleSaveObjectId || (() => {});
  const safeHandleSaveTemplate = handleSaveTemplate || (() => {});
  const safeHandleGeneratePDF = handleGeneratePDF || (() => {});
  const safeHandleWebView = onWebView || (() => {});

  return (
    <PropertyDashboardTab
      id={property.id}
      objectId={property.object_id}
      title={property.title || 'Untitled Property'}
      agentId={property.agent_id}
      agentName={agentInfo?.name}
      templateId={property.template_id}
      templateName={templateInfo?.name}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      onSave={() => console.log("Property saved")}
      onDelete={safeOnDelete}
      handleGeneratePDF={safeHandleGeneratePDF}
      handleWebView={safeHandleWebView}
      handleSaveAgent={safeHandleSaveAgent}
      handleSaveObjectId={safeHandleSaveObjectId}
      handleSaveTemplate={safeHandleSaveTemplate}
      isUpdating={isUpdating}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
    />
  );
}
