
import { PropertyTabs } from "./PropertyTabs";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { PropertyData } from "@/types/property";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { useFormSteps } from "@/hooks/useFormSteps";
import { usePropertyWebViewDialog } from "@/hooks/usePropertyWebViewDialog";
import { PropertyWebViewDialog } from "./PropertyWebViewDialog";
import { usePropertyAgentAndTemplate } from "@/hooks/usePropertyAgentAndTemplate";
import { Tabs } from "@/components/ui/tabs";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings: any;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function PropertyTabsWrapper({
  property,
  settings,
  onSave,
  onDelete,
}: PropertyTabsWrapperProps) {
  // Use custom hooks to organize functionality
  const { activeTab, setActiveTab } = usePropertyTabs();
  const { webViewOpen, setWebViewOpen, handleWebView } = usePropertyWebViewDialog();
  
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  
  // Fetch agent and template info
  const { agentInfo, templateInfo } = usePropertyAgentAndTemplate(formState);
  
  // Handle form submission
  const { handleSubmit } = usePropertyFormSubmit();
  
  // Use property actions
  const { handleGeneratePDF } = usePropertyActions(property.id);
  
  // Handle property content
  const {
    addFeature,
    removeFeature,
    updateFeature,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
  } = usePropertyContent(formState, handleFieldChange);
  
  // Handle property areas
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(formState, setFormState);
  
  // Handle property images
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage,
  } = usePropertyImages(formState, setFormState);
  
  // Define autosave function
  const handleAutosave = () => {
    console.log("Autosaving...");
  };
  
  // Form steps
  const { currentStep, handleStepClick, handleNext, handlePrevious } = useFormSteps(formState, handleAutosave, 5);

  // Form submission handler
  const onSubmit = () => {
    const formEl = document.getElementById('propertyForm') as HTMLFormElement;
    if (formEl) {
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
      handleSubmit(formEvent, formState, false);
    }
  };

  // Field change handlers
  const handleSaveObjectId = (objectId: string) => {
    handleFieldChange('object_id', objectId);
  };

  const handleSaveAgent = (agentId: string) => {
    handleFieldChange('agent_id', agentId);
  };

  const handleSaveTemplate = (templateId: string) => {
    handleFieldChange('template_id', templateId);
  };

  // Cast property to PropertyData to ensure it has required id
  const propertyWithRequiredId: PropertyData = {
    ...formState,
    id: property.id // Ensure id is always present
  };

  // Add back required properties for type compatibility
  const propertyWithMissingProps = {
    ...propertyWithRequiredId,
    featuredImage: propertyWithRequiredId.featuredImage || null,
    gridImages: propertyWithRequiredId.gridImages || []
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <PropertyTabs activeTab={activeTab} handleTabChange={setActiveTab}>
          <PropertyTabContents
            activeTab={activeTab}
            property={propertyWithMissingProps}
            formState={formState}
            agentInfo={agentInfo}
            templateInfo={templateInfo}
            isUpdating={false}
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
            isUploading={isUploading}
            handleAreaPhotosUpload={handleAreaPhotosUpload}
            handleFloorplanUpload={handleFloorplanUpload}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
            handleRemoveFloorplan={handleRemoveFloorplan}
            handleUpdateFloorplan={handleUpdateFloorplan}
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
      </Tabs>

      {/* Web View Dialog */}
      <PropertyWebViewDialog 
        property={propertyWithMissingProps} 
        open={webViewOpen} 
        onOpenChange={setWebViewOpen} 
      />
    </div>
  );
}
