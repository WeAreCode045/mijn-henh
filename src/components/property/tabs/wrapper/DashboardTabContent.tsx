
import { PropertyDashboardTab } from "../PropertyDashboardTab";

interface DashboardTabContentProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
  agentName?: string;
  templateId?: string;
  templateName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave: () => void;
  onDelete: () => Promise<void>;
  onGeneratePDF: () => void;
  onWebView: () => void;
  onSaveAgent: (agentId: string) => void;
  onSaveObjectId: (objectId: string) => void;
  onSaveTemplate: (templateId: string) => void;
  isUpdating: boolean;
}

export function DashboardTabContent({
  id,
  objectId,
  title,
  agentId,
  agentName,
  templateId,
  templateName,
  createdAt,
  updatedAt,
  onSave,
  onDelete,
  onGeneratePDF,
  onWebView,
  onSaveAgent,
  onSaveObjectId,
  onSaveTemplate,
  isUpdating,
}: DashboardTabContentProps) {
  return (
    <PropertyDashboardTab 
      id={id}
      objectId={objectId}
      title={title || "Untitled Property"}
      agentId={agentId}
      agentName={agentName}
      templateId={templateId}
      templateName={templateName}
      createdAt={createdAt}
      updatedAt={updatedAt}
      onSave={onSave}
      onDelete={onDelete}
      onGeneratePDF={onGeneratePDF}
      onWebView={onWebView}
      onSaveAgent={onSaveAgent}
      onSaveObjectId={onSaveObjectId}
      onSaveTemplate={onSaveTemplate}
      isUpdating={isUpdating}
    />
  );
}
