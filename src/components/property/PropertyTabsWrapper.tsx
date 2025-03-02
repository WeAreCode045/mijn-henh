
import { useState } from "react";
import { PropertyTabs } from "./PropertyTabs";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { PropertyData, PropertyTechnicalItem } from "@/types/property";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { useFormSteps } from "@/hooks/useFormSteps";
import { PropertyWebView } from "./PropertyWebView";
import { usePropertyWebView } from "./webview/usePropertyWebView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
  agentInfo,
  templateInfo
}: PropertyTabsWrapperProps) {
  const [webViewOpen, setWebViewOpen] = useState(false);
  const { activeTab, setActiveTab } = usePropertyTabs();
  
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  
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
    isInGridImages,
    isFeaturedImage,
    images
  } = usePropertyImages(formState, setFormState);
  
  // Define autosave function (placeholder for now)
  const handleAutosave = () => {
    console.log("Autosaving...");
    // Actual autosave logic would go here
  };
  
  // Form steps with corrected arguments
  const { currentStep, handleStepClick, handleNext, handlePrevious } = useFormSteps(formState, handleAutosave, 5);

  // Web view functions
  const handleWebView = () => {
    setWebViewOpen(true);
  };

  const onSubmit = () => {
    const formEl = document.getElementById('propertyForm') as HTMLFormElement;
    if (formEl) {
      // Create a FormEvent object
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
      // Pass false to prevent redirection
      handleSubmit(formEvent, formState, false);
    }
  };

  // Handle saving object ID
  const handleSaveObjectId = (objectId: string) => {
    handleFieldChange('object_id', objectId);
  };

  // Handle saving agent
  const handleSaveAgent = (agentId: string) => {
    handleFieldChange('agent_id', agentId);
  };

  // Handle saving template
  const handleSaveTemplate = (templateId: string) => {
    handleFieldChange('template_id', templateId);
  };

  // Cast property to PropertyData to ensure it has required id
  const propertyWithRequiredId: PropertyData = {
    ...formState,
    id: property.id // Ensure id is always present
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <PropertyTabs activeTab={activeTab} handleTabChange={setActiveTab}>
          <div>{/* Tab content placeholder */}</div>
        </PropertyTabs>

        <TabsContent value={activeTab}>
          <PropertyTabContents
            activeTab={activeTab}
            property={propertyWithRequiredId}
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
        </TabsContent>
      </Tabs>

      {/* WebView Dialog */}
      <Dialog open={webViewOpen} onOpenChange={setWebViewOpen}>
        <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <PropertyWebView 
              property={propertyWithRequiredId}
              open={webViewOpen} 
              onOpenChange={setWebViewOpen} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
