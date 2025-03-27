
import { TabsContent } from "@/components/ui/tabs";
import { PropertyData } from "@/types/property";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { useEffect } from "react";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formData?: any; // For content tab
  handlers?: any; // For content tab
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
  isUpdating: boolean;
  agentInfo?: { id: string; name: string } | null;
  [key: string]: any;
}

export function PropertyTabContents({
  activeTab,
  property,
  formData,
  handlers,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleGeneratePDF,
  handleWebView,
  isUpdating,
  agentInfo,
  ...props
}: PropertyTabContentsProps) {
  // Log the active tab for debugging
  useEffect(() => {
    console.log("PropertyTabContents - Active Tab:", activeTab);
    console.log("PropertyTabContents - Property ID:", property.id);
  }, [activeTab, property.id]);

  return (
    <>
      <TabsContent value="dashboard" className="space-y-6">
        <PropertyDashboardTab 
          id={property.id}
          title={property.title}
          objectId={property.object_id}
          agentId={property.agent_id}
          createdAt={property.created_at}
          updatedAt={property.updated_at}
          agentInfo={property.agent ? { id: property.agent.id, name: property.agent.name } : agentInfo}
          isUpdating={isUpdating}
          onSave={onSave}
          onDelete={onDelete}
          handleSaveObjectId={handleSaveObjectId}
          handleSaveAgent={handleSaveAgent}
          handleGeneratePDF={handleGeneratePDF}
          handleWebView={handleWebView}
        />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-6">
        <ContentTabWrapper 
          property={property} 
          formData={formData || property} 
          handlers={handlers || {}} 
          {...props} 
        />
      </TabsContent>
      
      <TabsContent value="media" className="space-y-6">
        <MediaTabContent property={property} {...props} />
      </TabsContent>
      
      <TabsContent value="communications" className="space-y-6">
        <CommunicationsTabContent 
          propertyId={property.id} 
          {...props} 
        />
      </TabsContent>
    </>
  );
}
