
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
  handleWebView: () => void;
}

export function DashboardTabContent({
  id,
  title,
  propertyData,
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
  const handleWebViewClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    handleWebView();
  };

  return (
    <PropertyDashboardTab
      id={id}
      title={title}
      propertyData={propertyData}
      objectId={objectId}
      agentId={agentId}
      createdAt={createdAt}
      updatedAt={updatedAt}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isUpdating={isUpdating}
      onSave={onSave}
      onDelete={onDelete}
      onSaveObjectId={handleSaveObjectId}
      onSaveAgent={handleSaveAgent}
      onSaveTemplate={handleSaveTemplate}
      onGeneratePDF={handleGeneratePDF}
      onWebView={handleWebViewClick}
    />
  );
}
