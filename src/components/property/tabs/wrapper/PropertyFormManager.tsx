
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
    onFetchLocationData: () => Promise.resolve({}),
    onFetchCategoryPlaces: () => Promise.resolve({}),
    onFetchNearbyCities: () => Promise.resolve({}),
    onGenerateLocationDescription: () => Promise.resolve({}),
    onGenerateMap: () => Promise.resolve({}),
    onRemoveNearbyPlace: () => {},
    isLoadingLocationData: false,
    isGeneratingMap: false,
    currentStep: formManagerProps.currentStep || 0,
    handleStepClick: formManagerProps.handleStepClick || (() => {}),
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
    onSubmit: formManagerProps.onSubmit || (() => {}),
    lastSaved: formManagerProps.lastSaved || null,
    isSaving: formManagerProps.isSaving || false,
  };
  
  // Pass all the props to the children render function
  return children(childrenProps);
}
