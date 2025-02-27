
import { useState } from "react";
import { PropertyTabs } from "./PropertyTabs";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyDashboardTab } from "./tabs/PropertyDashboardTab";
import { PropertyContentTab } from "./tabs/PropertyContentTab";
import { PropertyMediaTab } from "./tabs/PropertyMediaTab";
import { PropertySettingsTab } from "./tabs/PropertySettingsTab";
import { PropertyData } from "@/types/property";
import { Settings } from "@/types/settings";

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

  const handleGeneratePDF = () => {
    // Placeholder for PDF generation
    console.log("Generate PDF for property:", property.id);
  };

  const handleWebView = () => {
    // Placeholder for web view
    window.open(`/webview/${property.id}`, "_blank");
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
          currentStep={0}
          handleStepClick={() => {}}
          handleNext={() => {}}
          handlePrevious={() => {}}
          onSubmit={() => {}}
          onFieldChange={() => {}}
          onAddFeature={() => {}}
          onRemoveFeature={() => {}}
          onUpdateFeature={() => {}}
          onAddArea={() => {}}
          onRemoveArea={() => {}}
          onUpdateArea={() => {}}
          onAreaImageUpload={() => {}}
          onAreaImageRemove={() => {}}
          onAreaImagesSelect={() => {}}
          handleImageUpload={() => {}}
          handleAreaPhotosUpload={() => {}}
          handleFloorplanUpload={() => {}}
          handleRemoveImage={() => {}}
          handleRemoveAreaPhoto={() => {}}
          handleRemoveFloorplan={() => {}}
          handleSetFeaturedImage={() => {}}
          handleToggleGridImage={() => {}}
          isUpdateMode={true}
        />
      </TabsContent>
      
      <TabsContent value="media">
        <PropertyMediaTab 
          id={property.id}
          title={property.title}
          images={property.images}
          featuredImage={property.featuredImage}
          gridImages={property.gridImages}
          floorplans={property.floorplans}
          virtualTourUrl={property.virtualTourUrl}
          youtubeUrl={property.youtubeUrl}
          onUpload={() => {}}
          onRemove={() => {}}
          onFeaturedImageSelect={() => {}}
          onGridImageToggle={() => {}}
          onFloorplanUpload={() => {}}
          onFloorplanRemove={() => {}}
          onFloorplanUpdate={() => {}}
          onVirtualTourUpdate={() => {}}
          onYoutubeUrlUpdate={() => {}}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <PropertySettingsTab 
          id={property.id}
          objectId={property.object_id}
          agentId={property.agent_id}
          selectedTemplateId={templateInfo?.id}
          onDelete={onDelete}
        />
      </TabsContent>
    </PropertyTabs>
  );
}
