
import { useState } from "react";
import { PropertyTabs } from "./PropertyTabs";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyDashboardTab } from "./tabs/PropertyDashboardTab";
import { PropertyContentTab } from "./tabs/PropertyContentTab";
import { PropertyMediaTab } from "./tabs/PropertyMediaTab";
import { PropertySettingsTab } from "./tabs/PropertySettingsTab";
import { PropertyData, PropertyFormData } from "@/types/property";
import { Settings } from "@/types/settings";
import { usePropertySettings } from "@/hooks/usePropertySettings";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { usePropertyTechnicalData } from "@/hooks/usePropertyTechnicalData";

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
  const [formState, setFormState] = useState<PropertyFormData>(property);
  
  // Hooks for different functionalities
  const { isUpdating, handleSaveObjectId, handleSaveAgent, handleSaveTemplate } = usePropertySettings(
    property.id,
    onSave
  );
  
  const { handleGeneratePDF, handleWebView } = usePropertyActions(property.id);
  
  const { 
    currentStep,
    handleStepClick, 
    handleNext, 
    handlePrevious, 
    onSubmit, 
    handleFieldChange 
  } = usePropertyContent();

  const {
    technicalItems,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem
  } = usePropertyTechnicalData(formState, setFormData);

  // Create a typed wrapper function for setFormState that matches the expected signature
  function setFormData(data: PropertyFormData) {
    setFormState(data);
  }

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
          formData={formState}
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
          onAddTechnicalItem={addTechnicalItem}
          onRemoveTechnicalItem={removeTechnicalItem}
          onUpdateTechnicalItem={updateTechnicalItem}
          isUpdateMode={true}
          currentStep={currentStep}
          handleStepClick={handleStepClick}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          onSubmit={onSubmit}
        />
      </TabsContent>
      
      <TabsContent value="media">
        <PropertyMediaTab 
          id={property.id}
          title={property.title || ""}
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
          propertyId={property.id}
          objectId={property.object_id}
          agentId={property.agent_id}
          templateId={templateInfo?.id}
          onSaveObjectId={handleSaveObjectId}
          onSaveAgent={handleSaveAgent}
          onSaveTemplate={handleSaveTemplate}
          onDelete={onDelete}
          isUpdating={isUpdating}
        />
      </TabsContent>
    </PropertyTabs>
  );
}
