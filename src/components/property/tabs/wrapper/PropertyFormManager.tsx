
import { usePropertyFormManager } from "@/hooks/usePropertyFormManager";
import { PropertyFormManagerProps, PropertyFormManagerChildrenProps } from "./types/PropertyFormManagerTypes";

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Use the custom hook that combines all form-related functionality
  const formManagerProps = usePropertyFormManager(property);
  
  // Create props object that matches PropertyFormManagerChildrenProps structure
  const childrenProps: PropertyFormManagerChildrenProps = {
    formState: formManagerProps.formState,
    handleFieldChange: formManagerProps.handleFieldChange,
    handleSaveObjectId: formManagerProps.handleSaveObjectId,
    handleSaveAgent: formManagerProps.handleSaveAgent,
    handleSaveTemplate: formManagerProps.handleSaveTemplate,
    addFeature: formManagerProps.onAddFeature,
    removeFeature: formManagerProps.onRemoveFeature,
    updateFeature: formManagerProps.onUpdateFeature,
    addArea: formManagerProps.onAddArea,
    removeArea: formManagerProps.onRemoveArea,
    updateArea: formManagerProps.onUpdateArea,
    handleAreaImageRemove: formManagerProps.onAreaImageRemove,
    handleAreaImagesSelect: formManagerProps.onAreaImagesSelect,
    handleAreaImageUpload: formManagerProps.handleAreaImageUpload,
    onFetchLocationData: formManagerProps.onFetchLocationData,
    onFetchCategoryPlaces: formManagerProps.onFetchCategoryPlaces,
    onFetchNearbyCities: formManagerProps.onFetchNearbyCities,
    onGenerateLocationDescription: formManagerProps.onGenerateLocationDescription,
    onGenerateMap: formManagerProps.onGenerateMap,
    onRemoveNearbyPlace: formManagerProps.onRemoveNearbyPlace,
    isLoadingLocationData: formManagerProps.isLoadingLocationData,
    isGeneratingMap: formManagerProps.isGeneratingMap,
    currentStep: formManagerProps.currentStep,
    handleStepClick: formManagerProps.handleStepClick,
    setPendingChanges: formManagerProps.setPendingChanges,
    // Add properties for compatibility
    propertyWithRequiredProps: property,
    handleImageUpload: formManagerProps.handleImageUpload,
    handleRemoveImage: formManagerProps.handleRemoveImage,
    isUploading: formManagerProps.isUploading,
    // Implementation for missing properties
    handleAreaPhotosUpload: formManagerProps.handleAreaPhotosUpload || (() => Promise.resolve()),
    handleRemoveAreaPhoto: formManagerProps.handleRemoveAreaPhoto || (() => {}),
    handleFloorplanUpload: formManagerProps.handleFloorplanUpload || (() => {}),
    handleRemoveFloorplan: formManagerProps.handleRemoveFloorplan || (() => {}),
    isUploadingFloorplan: formManagerProps.isUploadingFloorplan || false,
    handleSetFeaturedImage: formManagerProps.handleSetFeaturedImage || (() => {}),
    handleToggleFeaturedImage: formManagerProps.handleToggleFeaturedImage || (() => {}),
    handleVirtualTourUpdate: formManagerProps.handleVirtualTourUpdate || (() => {}),
    handleYoutubeUrlUpdate: formManagerProps.handleYoutubeUrlUpdate || (() => {}),
    handleFloorplanEmbedScriptUpdate: formManagerProps.handleFloorplanEmbedScriptUpdate || (() => {}),
    // Aliases for compatibility
    onAddFeature: formManagerProps.onAddFeature,
    onRemoveFeature: formManagerProps.onRemoveFeature,
    onUpdateFeature: formManagerProps.onUpdateFeature,
    onAddArea: formManagerProps.onAddArea,
    onRemoveArea: formManagerProps.onRemoveArea,
    onUpdateArea: formManagerProps.onUpdateArea,
    onAreaImageRemove: formManagerProps.onAreaImageRemove,
    onAreaImagesSelect: formManagerProps.onAreaImagesSelect,
    images: formManagerProps.images || [],
    onSubmit: () => {}, // Empty function as a placeholder
    lastSaved: null,
    isSaving: false,
  };
  
  // Pass all the props to the children render function
  return children(childrenProps);
}
