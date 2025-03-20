
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

interface DashboardTabContentProps {
  id: string;
  title: string;
  objectId?: string;
  agentId?: string;
  createdAt?: string;
  updatedAt?: string;
  agentInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
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
  isUpdating,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
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
      isUpdating={isUpdating}
      onSave={onSave}
      onDelete={onDelete}
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={handleSaveAgent}
      handleGeneratePDF={handleGeneratePDF}
      handleWebView={handleWebView}
    />
  );
}
