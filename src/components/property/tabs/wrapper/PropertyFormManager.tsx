
import { usePropertyFormManager } from "@/hooks/property-form/usePropertyFormManager";
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
    onSubmit: formManagerProps.onSubmit,
    currentStep: formManagerProps.currentStep,
    handleStepClick: formManagerProps.handleStepClick,
    lastSaved: formManagerProps.lastSaved,
    isSaving: formManagerProps.isSaving,
    setPendingChanges: formManagerProps.setPendingChanges,
    // Add missing properties for compatibility
    propertyWithRequiredProps: {
      ...property,
      id: property.id || '', // Ensure id is always at least an empty string
    },
    handleImageUpload: formManagerProps.handleImageUpload,
    handleRemoveImage: formManagerProps.handleRemoveImage,
    isUploading: formManagerProps.isUploading,
    // Placeholder implementations for missing properties
    handleAreaPhotosUpload: async () => {}, // Add stub implementation
    handleRemoveAreaPhoto: () => {}, // Add stub implementation
    handleFloorplanUpload: () => {}, // Add stub implementation
    handleRemoveFloorplan: () => {}, // Add stub implementation
    isUploadingFloorplan: false, // Add default value
    handleSetFeaturedImage: () => {}, // Add stub implementation
    handleToggleFeaturedImage: () => {}, // Add stub implementation
    handleVirtualTourUpdate: () => {}, // Add stub implementation
    handleYoutubeUrlUpdate: () => {}, // Add stub implementation
    handleFloorplanEmbedScriptUpdate: () => {}, // Add stub implementation
    // Add aliases for compatibility
    onAddFeature: formManagerProps.onAddFeature,
    onRemoveFeature: formManagerProps.onRemoveFeature,
    onUpdateFeature: formManagerProps.onUpdateFeature,
    onAddArea: formManagerProps.onAddArea,
    onRemoveArea: formManagerProps.onRemoveArea,
    onUpdateArea: formManagerProps.onUpdateArea,
    onAreaImageRemove: formManagerProps.onAreaImageRemove,
    onAreaImagesSelect: formManagerProps.onAreaImagesSelect,
    images: formManagerProps.images || []
  };
  
  // Pass all the props to the children render function
  return children(childrenProps);
}
