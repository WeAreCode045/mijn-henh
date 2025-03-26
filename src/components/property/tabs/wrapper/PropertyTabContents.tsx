
import { TabsContent } from "@/components/ui/tabs";
import { PropertyData } from "@/types/property";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formData?: any; // For content tab
  handlers?: any; // For content tab
  [key: string]: any; // Additional props
}

export function PropertyTabContents({
  activeTab,
  property,
  formData,
  handlers,
  ...props
}: PropertyTabContentsProps) {
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
          agentInfo={property.agent ? { id: property.agent.id, name: property.agent.name } : null}
          isUpdating={false}
          onSave={props.onSave || (() => {})}
          onDelete={props.onDelete || (async () => {})}
          handleSaveObjectId={props.handleSaveObjectId || (async () => {})}
          handleSaveAgent={props.handleSaveAgent || (async () => {})}
          handleGeneratePDF={props.handleGeneratePDF || (() => {})}
          handleWebView={props.handleWebView || (() => {})}
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
