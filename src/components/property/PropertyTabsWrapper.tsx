
import { PropertyTabs } from "./PropertyTabs";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { PropertyData } from "@/types/property";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { PropertyFormManager } from "./tabs/wrapper/PropertyFormManager";
import { PropertyTabActionsHandler } from "./tabs/wrapper/PropertyTabActionsHandler";
import { PropertyWebViewDialog } from "./tabs/wrapper/PropertyWebViewDialog";
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
  agentInfo,
  templateInfo
}: PropertyTabsWrapperProps) {
  const { activeTab, setActiveTab } = usePropertyTabs();
  console.log("PropertyTabsWrapper - Active tab:", activeTab);
  
  return (
    <div className="space-y-6">
      <PropertyTabActionsHandler propertyId={property.id}>
        {({ webViewOpen, setWebViewOpen, handleGeneratePDF, handleOpenWebView }) => (
          <PropertyFormManager property={property}>
            {({ 
              formState, 
              handleFieldChange,
              handleSaveObjectId,
              handleSaveAgent,
              handleSaveTemplate,
              addFeature,
              removeFeature,
              updateFeature,
              addTechnicalItem,
              removeTechnicalItem,
              updateTechnicalItem,
              addArea,
              removeArea,
              updateArea,
              handleAreaImageUpload,
              handleAreaImageRemove,
              handleAreaImagesSelect,
              handleImageUpload,
              handleRemoveImage,
              isUploading,
              handleAreaPhotosUpload,
              handleFloorplanUpload,
              handleRemoveAreaPhoto,
              handleRemoveFloorplan,
              handleUpdateFloorplan,
              handleSetFeaturedImage,
              handleToggleCoverImage,
              onSubmit,
              currentStep,
              handleStepClick,
              handleNext,
              handlePrevious,
              propertyWithRequiredProps
            }) => (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <PropertyTabs activeTab={activeTab} handleTabChange={setActiveTab}>
                    <PropertyTabContents
                      activeTab={activeTab}
                      property={propertyWithRequiredProps}
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
                      handleWebView={handleOpenWebView}
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
                      handleToggleCoverImage={handleToggleCoverImage}
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

                {/* WebView Dialog */}
                <PropertyWebViewDialog
                  propertyData={propertyWithRequiredProps}
                  isOpen={webViewOpen}
                  onOpenChange={setWebViewOpen}
                />
              </>
            )}
          </PropertyFormManager>
        )}
      </PropertyTabActionsHandler>
    </div>
  );
}
