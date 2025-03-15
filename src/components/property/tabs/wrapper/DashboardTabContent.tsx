
import { PropertyDashboardTab } from "../PropertyDashboardTab";

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
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
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
  return (
    <PropertyDashboardTab
      id={id}
      title={title}
      property={propertyData} // Changed from propertyData to property to match expected props
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
      onWebView={handleWebView}
    />
  );
}
