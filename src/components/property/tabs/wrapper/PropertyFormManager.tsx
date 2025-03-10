
import { usePropertyFormManager } from "@/hooks/usePropertyFormManager";
import { PropertyFormManagerProps } from "./types/PropertyFormManagerTypes";

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Use the custom hook that combines all form-related functionality
  const formManagerProps = usePropertyFormManager(property);
  
  // Extract all the props we need to pass to children
  const { 
    formState,
    handleFieldChange,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    addFeature,
    removeFeature,
    updateFeature,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    propertyWithRequiredProps,
    lastSaved,
    isSaving
  } = formManagerProps;
  
  // Pass all the props to the children render function
  return children({
    formState,
    handleFieldChange,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    addFeature,
    removeFeature,
    updateFeature,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    propertyWithRequiredProps,
    lastSaved,
    isSaving
  });
}
