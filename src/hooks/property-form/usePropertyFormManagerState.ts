
import { useState, useCallback, useMemo } from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { usePropertyFormState } from "@/hooks/property-form/usePropertyFormState";
import { usePropertyFormActions } from "@/hooks/property-form/usePropertyFormActions";
import { usePropertyFormFields } from "@/hooks/property-form/usePropertyFormFields";
import { usePropertyFormImages } from "@/hooks/property-form/usePropertyFormImages";
import { usePropertyFormAreas } from "@/hooks/property-form/usePropertyFormAreas";
import { usePropertyFormSteps } from "@/hooks/property-form/usePropertyFormSteps";
import { usePropertyLocationData } from "@/hooks/property-form/usePropertyLocationData";

export function usePropertyFormManagerState(property: PropertyData, isArchived: boolean = false) {
  const [lastSaved, setLastSaved] = useState<Date | null>(
    property.updated_at ? new Date(property.updated_at) : null
  );
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Setup form state
  const { formState, handleFieldChange } = usePropertyFormState(property, setPendingChanges);
  
  // Property form actions
  const { 
    handleSaveObjectId, 
    handleSaveAgent, 
    onSubmit 
  } = usePropertyFormActions(
    formState,
    setPendingChanges,
    setLastSaved
  );
  
  // Property form fields
  const { 
    addFeature, 
    removeFeature, 
    updateFeature 
  } = usePropertyFormFields(
    formState, 
    handleFieldChange
  );
  
  // Property form images
  const imagesData = usePropertyFormImages(
    formState.id, 
    formState, 
    handleFieldChange, 
    setPendingChanges
  );
  
  // Extract images-related properties and functions
  const { 
    handleImageUpload, 
    handleRemoveImage, 
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    images
  } = imagesData;
  
  // Property form areas
  const { 
    addArea, 
    removeArea, 
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    handleAreaPhotosUpload, 
    handleRemoveAreaPhoto
  } = usePropertyFormAreas(
    formState, 
    handleFieldChange, 
    setPendingChanges
  );
  
  // Property form steps
  const { 
    currentStep, 
    handleStepClick 
  } = usePropertyFormSteps();
  
  // Property form location data
  const {
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onFetchCategoryPlaces,
    onFetchNearbyCities
  } = usePropertyLocationData(
    formState,
    handleFieldChange,
    setPendingChanges
  );

  // Add property ID to formState if it doesn't exist
  const propertyWithRequiredProps = useMemo(() => ({
    ...formState,
    id: formState.id || '',
  }), [formState]);

  return {
    formState,
    lastSaved,
    pendingChanges,
    isSaving,
    setPendingChanges,
    handleFieldChange,
    handleSaveObjectId,
    handleSaveAgent,
    addFeature,
    removeFeature,
    updateFeature,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
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
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    onSubmit,
    currentStep,
    handleStepClick,
    propertyWithRequiredProps,
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onFetchCategoryPlaces,
    onFetchNearbyCities,
    // Make sure images is included in the return
    images
  };
}
