
import { usePropertyFormManager } from "@/hooks/usePropertyFormManager";
import { PropertyFormManagerProps } from "./types/PropertyFormManagerTypes";

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Use the custom hook that combines all form-related functionality
  const formManagerProps = usePropertyFormManager(property);
  
  // Create props object that matches PropertyFormManagerChildrenProps structure
  const childrenProps = {
    formState: formManagerProps.formState,
    handleFieldChange: formManagerProps.handleFieldChange,
    handleSaveObjectId: formManagerProps.handleSaveObjectId,
    handleSaveAgent: formManagerProps.handleSaveAgent,
    handleSaveTemplate: formManagerProps.handleSaveTemplate,
    onAddFeature: formManagerProps.onAddFeature,
    onRemoveFeature: formManagerProps.onRemoveFeature,
    onUpdateFeature: formManagerProps.onUpdateFeature,
    onAddArea: formManagerProps.onAddArea,
    onRemoveArea: formManagerProps.onRemoveArea,
    onUpdateArea: formManagerProps.onUpdateArea,
    onAreaImageRemove: formManagerProps.onAreaImageRemove,
    onAreaImagesSelect: formManagerProps.onAreaImagesSelect,
    handleAreaImageUpload: formManagerProps.handleAreaImageUpload,
    onFetchLocationData: formManagerProps.onFetchLocationData,
    onFetchCategoryPlaces: formManagerProps.onFetchCategoryPlaces,
    onFetchNearbyCities: formManagerProps.onFetchNearbyCities,
    onGenerateLocationDescription: formManagerProps.onGenerateLocationDescription,
    onGenerateMap: formManagerProps.onGenerateMap,
    onRemoveNearbyPlace: formManagerProps.onRemoveNearbyPlace,
    isLoadingLocationData: formManagerProps.isLoadingLocationData,
    isGeneratingMap: formManagerProps.isGeneratingMap,
    onSubmit: formManagerProps.onSubmit,
    currentStep: formManagerProps.currentStep,
    handleStepClick: formManagerProps.handleStepClick,
    lastSaved: formManagerProps.lastSaved,
    isSaving: formManagerProps.isSaving,
    setPendingChanges: formManagerProps.setPendingChanges,
    // Add missing properties for compatibility
    propertyWithRequiredProps: property,
    handleImageUpload: formManagerProps.handleImageUpload,
    handleRemoveImage: formManagerProps.handleRemoveImage,
    isUploading: formManagerProps.isUploading,
    handleAreaPhotosUpload: formManagerProps.handleAreaPhotosUpload,
    handleRemoveAreaPhoto: formManagerProps.handleRemoveAreaPhoto,
    handleFloorplanUpload: formManagerProps.handleFloorplanUpload,
    handleRemoveFloorplan: formManagerProps.handleRemoveFloorplan,
    isUploadingFloorplan: formManagerProps.isUploadingFloorplan,
    handleSetFeaturedImage: formManagerProps.handleSetFeaturedImage,
    handleToggleFeaturedImage: formManagerProps.handleToggleFeaturedImage,
    handleVirtualTourUpdate: formManagerProps.handleVirtualTourUpdate,
    handleYoutubeUrlUpdate: formManagerProps.handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate: formManagerProps.handleFloorplanEmbedScriptUpdate,
    // Add aliases for compatibility
    addFeature: formManagerProps.onAddFeature,
    removeFeature: formManagerProps.onRemoveFeature,
    updateFeature: formManagerProps.onUpdateFeature,
    addArea: formManagerProps.onAddArea,
    removeArea: formManagerProps.onRemoveArea,
    updateArea: formManagerProps.onUpdateArea,
    images: formManagerProps.images
  };
  
  // Pass all the props to the children render function
  return children(childrenProps);
}
