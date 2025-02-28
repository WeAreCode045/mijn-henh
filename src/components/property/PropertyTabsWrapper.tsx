
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
import { usePropertyImages } from "@/hooks/usePropertyImages";

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
    handleAreaImageRemove,
    handleAreaImagesSelect
  } = usePropertyAreas(formState, setFormState);

  const {
    addFeature,
    removeFeature,
    updateFeature
  } = useFeatures(formState, setFormState);

  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formState, setFormState);

  // Create a typed wrapper function for setFormState that matches the expected signature
  function setFormData(data: PropertyFormData) {
    console.log("Setting form data:", data);
    setFormState(data);
  }

  // Update this function to properly handle the field change by accepting all required parameters
  const handleFieldChangeWrapper = (field: keyof PropertyFormData, value: any) => {
    console.log(`Field changed: ${String(field)} = `, value);
    // Instead of calling handleFieldChange with formState and setFormState,
    // we'll update formState directly since handleFieldChange expects different parameters
    setFormState({
      ...formState,
      [field]: value
    });
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
          onAreaImageRemove={handleAreaImageRemove}
          onAreaImagesSelect={handleAreaImagesSelect}
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImage}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleUpdateFloorplan={handleUpdateFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
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
          onUpload={handleImageUpload}
          onRemove={handleRemoveImage}
          onFeaturedImageSelect={handleSetFeaturedImage}
          onGridImageToggle={handleToggleGridImage}
          onFloorplanUpload={handleFloorplanUpload}
          onFloorplanRemove={handleRemoveFloorplan}
          onFloorplanUpdate={handleUpdateFloorplan}
          onVirtualTourUpdate={(url) => handleFieldChangeWrapper('virtualTourUrl', url)}
          onYoutubeUrlUpdate={(url) => handleFieldChangeWrapper('youtubeUrl', url)}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
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
