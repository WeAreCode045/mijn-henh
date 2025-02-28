
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
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { useFeatures } from "@/hooks/useFeatures";

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
  } = usePropertyTechnicalData(formState, setFormState);

  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove, // Corrected from removeAreaImage to handleAreaImageRemove
    handleAreaImagesSelect
  } = usePropertyAreas(formState, setFormState);

  const {
    addFeature,
    removeFeature,
    updateFeature
  } = useFeatures(formState, setFormState);

  // Create a typed wrapper function for setFormState that matches the expected signature
  function setFormData(data: PropertyFormData) {
    console.log("Setting form data:", data);
    setFormState(data);
  }

  const handleFieldChangeWrapper = (field: keyof PropertyFormData, value: any) => {
    console.log(`Field changed: ${String(field)} = `, value);
    handleFieldChange(formState, setFormState, field, value);
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
          formData={formState}
          onFieldChange={handleFieldChangeWrapper}
          onAddFeature={addFeature}
          onRemoveFeature={removeFeature}
          onUpdateFeature={updateFeature}
          onAddArea={addArea}
          onRemoveArea={removeArea}
          onUpdateArea={updateArea}
          onAreaImageUpload={handleAreaImageUpload}
          onAreaImageRemove={handleAreaImageRemove} // Corrected the property name
          onAreaImagesSelect={handleAreaImagesSelect}
          handleImageUpload={(e) => console.log("Image upload", e)}
          handleAreaPhotosUpload={(e) => console.log("Area photos upload", e)}
          handleFloorplanUpload={(e) => console.log("Floorplan upload", e)}
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
