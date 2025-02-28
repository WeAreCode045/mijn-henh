
import { PropertyTabs } from "./PropertyTabs";
import { PropertyData, PropertyFormData } from "@/types/property";
import { Settings } from "@/types/settings";
import { usePropertySettings } from "@/hooks/usePropertySettings";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { usePropertyTechnicalData } from "@/hooks/usePropertyTechnicalData";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";

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
  // Tab state management
  const { activeTab, setActiveTab } = usePropertyTabs();
  
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  
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
    onSubmit
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

  return (
    <PropertyTabs activeTab={activeTab} onTabChange={setActiveTab}>
      <PropertyTabContents
        activeTab={activeTab}
        property={property}
        formState={formState}
        agentInfo={agentInfo}
        templateInfo={templateInfo}
        isUpdating={isUpdating}
        onSave={onSave}
        onDelete={onDelete}
        handleSaveObjectId={handleSaveObjectId}
        handleSaveAgent={handleSaveAgent}
        handleSaveTemplate={handleSaveTemplate}
        handleGeneratePDF={handleGeneratePDF}
        handleWebView={handleWebView}
        onFieldChange={handleFieldChange}
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
        handleRemoveImage={handleRemoveImage}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveFloorplan={handleRemoveFloorplan}
        handleUpdateFloorplan={handleUpdateFloorplan}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleGridImage={handleToggleGridImage}
        onAddTechnicalItem={addTechnicalItem}
        onRemoveTechnicalItem={removeTechnicalItem}
        onUpdateTechnicalItem={updateTechnicalItem}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onSubmit={onSubmit}
      />
    </PropertyTabs>
  );
}
