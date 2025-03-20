
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

interface DashboardTabContentProps {
  id: string;
  title: string;
  propertyData?: any; 
  objectId?: string;
  agentId?: string;
  createdAt?: string;
  updatedAt?: string;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveTemplate: (templateId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
}

export function DashboardTabContent({
  id,
  title,
  objectId,
  agentId,
  createdAt,
  updatedAt,
  agentInfo,
  templateInfo,
  isUpdating,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  handleGeneratePDF,
  handleWebView,
}: DashboardTabContentProps) {
  return (
    <PropertyDashboardTab
      id={id}
      title={title}
      objectId={objectId}
      agentId={agentId}
      createdAt={createdAt}
      updatedAt={updatedAt}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isUpdating={isUpdating}
      onSave={onSave}
      onDelete={onDelete}
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={handleSaveAgent}
      handleSaveTemplate={handleSaveTemplate}
      handleGeneratePDF={handleGeneratePDF}
      handleWebView={handleWebView}
    />
  );
}
