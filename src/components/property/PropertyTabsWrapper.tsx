
import { useState } from "react";
import { PropertyTabs } from "./PropertyTabs";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyDashboardTab } from "./tabs/PropertyDashboardTab";
import { PropertyContentTab } from "./tabs/PropertyContentTab";
import { PropertyMediaTab } from "./tabs/PropertyMediaTab";
import { PropertySettingsTab } from "./tabs/PropertySettingsTab";
import { PropertyData } from "@/types/property";
import { Settings } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings?: Settings | null;
  onSave: () => void;
  onDelete: () => Promise<void>;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function PropertyTabsWrapper({
  property,
  settings,
  onSave,
  onDelete,
  agentInfo,
  templateInfo
}: PropertyTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleGeneratePDF = () => {
    // Placeholder for PDF generation
    console.log("Generate PDF for property:", property.id);
  };

  const handleWebView = () => {
    // Placeholder for web view
    window.open(`/webview/${property.id}`, "_blank");
  };

  // Settings tab functions
  const handleSaveSettings = async (objectId: string, agentId: string, templateId: string) => {
    if (!property.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Update only the fields that are passed
      const updateData: any = {};
      if (objectId !== undefined) updateData.object_id = objectId;
      if (agentId !== undefined) updateData.agent_id = agentId;
      if (templateId !== undefined && templateId !== property.template_id) updateData.template_id = templateId;
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('properties')
          .update(updateData)
          .eq('id', property.id);
        
        if (error) throw error;
        
        toast({
          description: "Settings saved successfully",
        });
        
        // Trigger a refresh/save of the property data
        onSave();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Pass content-specific handlers for each tab
  const handleFieldChange = (field: any, value: any) => {
    console.log(`Field ${field} changed to:`, value);
    // This would normally update the formData in the parent component
  };

  return (
    <PropertyTabs activeTab={activeTab} onTabChange={setActiveTab}>
      <TabsContent value="dashboard">
        <PropertyDashboardTab 
          id={property.id}
          objectId={property.object_id}
          title={property.title || "Untitled Property"}
          agentId={property.agent_id}
          agentName={agentInfo?.name}
          templateId={templateInfo?.id}
          templateName={templateInfo?.name}
          createdAt={property.created_at}
          updatedAt={property.updated_at}
          onSave={onSave}
          onDelete={onDelete}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
        />
      </TabsContent>
      
      <TabsContent value="content">
        <PropertyContentTab 
          formData={property}
          onFieldChange={handleFieldChange}
          onAddFeature={() => console.log("Add feature")}
          onRemoveFeature={(id) => console.log("Remove feature", id)}
          onUpdateFeature={(id, desc) => console.log("Update feature", id, desc)}
          onAddArea={() => console.log("Add area")}
          onRemoveArea={(id) => console.log("Remove area", id)}
          onUpdateArea={(id, field, value) => console.log("Update area", id, field, value)}
          onAreaImageUpload={(id, files) => console.log("Upload area image", id, files)}
          onAreaImageRemove={(areaId, imageId) => console.log("Remove area image", areaId, imageId)}
          onAreaImagesSelect={(areaId, imageIds) => console.log("Select area images", areaId, imageIds)}
          handleImageUpload={() => console.log("Upload image")}
          handleAreaPhotosUpload={() => console.log("Upload area photos")}
          handleFloorplanUpload={() => console.log("Upload floorplan")}
          handleRemoveImage={(index) => console.log("Remove image", index)}
          handleRemoveAreaPhoto={(index) => console.log("Remove area photo", index)}
          handleRemoveFloorplan={(index) => console.log("Remove floorplan", index)}
          handleSetFeaturedImage={(url) => console.log("Set featured image", url)}
          handleToggleGridImage={(url) => console.log("Toggle grid image", url)}
          isUpdateMode={true}
        />
      </TabsContent>
      
      <TabsContent value="media">
        <PropertyMediaTab 
          id={property.id}
          title={property.title}
          images={property.images || []}
          featuredImage={property.featuredImage}
          gridImages={property.gridImages || []}
          floorplans={property.floorplans || []}
          virtualTourUrl={property.virtualTourUrl}
          youtubeUrl={property.youtubeUrl}
          onUpload={() => console.log("Upload")}
          onRemove={() => console.log("Remove")}
          onFeaturedImageSelect={() => console.log("Select featured image")}
          onGridImageToggle={() => console.log("Toggle grid image")}
          onFloorplanUpload={() => console.log("Upload floorplan")}
          onFloorplanRemove={() => console.log("Remove floorplan")}
          onFloorplanUpdate={() => console.log("Update floorplan")}
          onVirtualTourUpdate={() => console.log("Update virtual tour")}
          onYoutubeUrlUpdate={() => console.log("Update YouTube URL")}
          onImageUpload={() => console.log("Upload image")}
          onRemoveImage={() => console.log("Remove image")}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <PropertySettingsTab 
          id={property.id}
          objectId={property.object_id || ""}
          agentId={property.agent_id || ""}
          selectedTemplateId={templateInfo?.id || "default"}
          onDelete={onDelete}
          onSaveSettings={handleSaveSettings}
          isUpdating={isUpdating}
        />
      </TabsContent>
    </PropertyTabs>
  );
}
