
import { PropertyFormData, PropertyData } from "@/types/property";
import { PropertyTabs } from "../../PropertyTabs";
import { PropertyTabContents } from "./PropertyTabContents";
import { PropertyWebViewDialog } from "./PropertyWebViewDialog";
import { Tabs } from "@/components/ui/tabs";
import { useAdaptedAreaPhotoHandlers } from "./PropertyAreaPhotoHandlers";

interface PropertyTabContentSetupProps {
  property: PropertyData;
  formState: PropertyFormData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  handleWebViewProps: {
    webViewOpen: boolean;
    setWebViewOpen: (open: boolean) => void;
    handleGeneratePDF: () => void;
    handleOpenWebView: () => void;
  };
  formHandlers: any; // Using any to simplify the extensive list of handlers
  onDelete?: () => Promise<void>;
}

export function PropertyTabContentSetup({
  property,
  formState,
  activeTab,
  setActiveTab,
  agentInfo,
  templateInfo,
  handleWebViewProps,
  formHandlers,
  onDelete
}: PropertyTabContentSetupProps) {
  const { webViewOpen, setWebViewOpen } = handleWebViewProps;
  
  // Create adapted area photo handlers to resolve type compatibility issues
  const { 
    adaptedHandleAreaPhotosUpload, 
    adaptedHandleRemoveAreaPhoto,
    adaptedHandleAreaImageUpload 
  } = useAdaptedAreaPhotoHandlers(
    formHandlers.handleAreaPhotosUpload,
    formHandlers.handleAreaImageUpload, 
    formHandlers.handleRemoveAreaPhoto,
    formHandlers.handleAreaImageRemove
  );

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <PropertyTabs activeTab={activeTab} handleTabChange={setActiveTab}>
          <PropertyTabContents
            activeTab={activeTab}
            property={property}
            formState={formState}
            agentInfo={agentInfo || { id: '', name: '' }}
            templateInfo={templateInfo || { id: 'default', name: 'Default Template' }}
            isUpdating={false}
            onDelete={onDelete || (() => Promise.resolve())}
            handleSaveObjectId={formHandlers.handleSaveObjectId}
            handleSaveAgent={formHandlers.handleSaveAgent}
            handleSaveTemplate={formHandlers.handleSaveTemplate}
            handleGeneratePDF={handleWebViewProps.handleGeneratePDF}
            handleWebView={handleWebViewProps.handleOpenWebView}
            onFieldChange={formHandlers.handleFieldChange}
            onAddFeature={formHandlers.addFeature}
            onRemoveFeature={formHandlers.removeFeature}
            onUpdateFeature={formHandlers.updateFeature}
            onAddArea={formHandlers.addArea}
            onRemoveArea={formHandlers.removeArea}
            onUpdateArea={formHandlers.updateArea}
            onAreaImageRemove={formHandlers.handleAreaImageRemove}
            onAreaImagesSelect={formHandlers.handleAreaImagesSelect}
            onAreaImageUpload={formHandlers.handleAreaImageUpload}
            handleImageUpload={formHandlers.handleImageUpload}
            handleRemoveImage={formHandlers.handleRemoveImage}
            isUploading={formHandlers.isUploading}
            handleAreaPhotosUpload={adaptedHandleAreaPhotosUpload}
            handleRemoveAreaPhoto={formHandlers.handleRemoveAreaPhoto || (() => {})}
            handleFloorplanUpload={formHandlers.handleFloorplanUpload}
            handleRemoveFloorplan={formHandlers.handleRemoveFloorplan}
            isUploadingFloorplan={formHandlers.isUploadingFloorplan}
            handleSetFeaturedImage={formHandlers.handleSetFeaturedImage}
            handleToggleFeaturedImage={formHandlers.handleToggleFeaturedImage}
            handleVirtualTourUpdate={formHandlers.handleVirtualTourUpdate}
            handleYoutubeUrlUpdate={formHandlers.handleYoutubeUrlUpdate}
            handleFloorplanEmbedScriptUpdate={formHandlers.handleFloorplanEmbedScriptUpdate}
            currentStep={formHandlers.currentStep}
            handleStepClick={formHandlers.handleStepClick}
            setPendingChanges={formHandlers.setPendingChanges}
            onFetchLocationData={formHandlers.onFetchLocationData}
            onGenerateLocationDescription={formHandlers.onGenerateLocationDescription}
            onGenerateMap={formHandlers.onGenerateMap}
            onRemoveNearbyPlace={formHandlers.onRemoveNearbyPlace}
            isLoadingLocationData={formHandlers.isLoadingLocationData}
            isGeneratingMap={formHandlers.isGeneratingMap}
            onSubmit={() => console.log("Submit functionality has been disabled")}
          />
        </PropertyTabs>
      </Tabs>

      {/* WebView Dialog */}
      <PropertyWebViewDialog
        propertyData={property}
        isOpen={webViewOpen}
        onOpenChange={setWebViewOpen}
      />
    </>
  );
}
