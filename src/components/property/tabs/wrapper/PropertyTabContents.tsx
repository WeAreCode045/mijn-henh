
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
        <PropertyDashboardTab propertyData={property} {...props} />
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
