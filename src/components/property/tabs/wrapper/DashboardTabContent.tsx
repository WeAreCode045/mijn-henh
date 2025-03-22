
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";
import { PropertyData } from "@/types/property";

interface DashboardTabContentProps {
  property: PropertyData;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
}

export function DashboardTabContent({
  property,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleGeneratePDF,
  handleWebView,
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
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={handleSaveAgent}
      handleGeneratePDF={handleGeneratePDF}
      handleWebView={handleWebView}
    />
  );
}
