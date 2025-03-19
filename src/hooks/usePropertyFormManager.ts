
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/usePropertyFormState';
import { usePropertyFeatures } from './property-form/usePropertyFeatures';
import { usePropertyAreas } from './property-form/usePropertyAreas';
import { usePropertyContent } from './property-form/usePropertyContent';
import { usePropertyImages } from './property-form/usePropertyImages';
import { usePropertyFloorplans } from './images/usePropertyFloorplans';
import { usePropertyAreaPhotos } from './images/usePropertyAreaPhotos';
import { usePropertyCoverImages } from './usePropertyCoverImages';
import { usePropertyMediaHandlers } from './property-form/usePropertyMediaHandlers';
import { useSaveHandlers } from './property-form/useSaveHandlers';
import { createFieldChangeWrapper } from './property-form/utils/fieldChangeUtils';

export function usePropertyFormManager(property: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(property);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Hook for handling form state
  const { 
    handleFieldChange 
  } = usePropertyFormState(formState, setFormState);
  
  // Create a wrapper function for hooks that expect a function with (data: PropertyFormData) signature
  const fieldChangeWrapper = createFieldChangeWrapper(handleFieldChange);
  
  // Hook for managing features
  const { 
    addFeature, 
    removeFeature, 
    updateFeature 
  } = usePropertyFeatures(formState, handleFieldChange);
  
  // Hook for managing areas
  const { 
    addArea, 
    removeArea, 
    updateArea, 
    handleAreaImageRemove, 
    handleAreaImagesSelect, 
    handleAreaImageUpload,
    isUploading
  } = usePropertyAreas(formState, handleFieldChange);
  
  // Property content hook (for loading/saving data)
  const propertyContentHook = usePropertyContent(property.id);
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(formState, handleFieldChange);
  
  // Get the floorplan hooks
  const floorplanHooks = usePropertyFloorplans(formState, fieldChangeWrapper);
  
  // Hook for managing area photos
  const {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto
  } = usePropertyAreaPhotos(formState, setFormState);
  
  // Get the cover image hooks
  const coverImageHooks = usePropertyCoverImages(formState, fieldChangeWrapper);
  
  // Media update handlers
  const {
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  } = usePropertyMediaHandlers(formState, handleFieldChange);
  
  // Save handlers
  const {
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  } = useSaveHandlers(handleFieldChange);
  
  // Handle form step navigation
  const handleStepClick = (step: number) => {
    console.log(`Setting current step to: ${step}`);
    setCurrentStep(step);
  };
  
  return {
    formState,
    handleFieldChange,
    
    // Feature methods
    onAddFeature: addFeature,
    onRemoveFeature: removeFeature,
    onUpdateFeature: updateFeature,
    
    // Area methods
    onAddArea: addArea,
    onRemoveArea: removeArea,
    onUpdateArea: updateArea,
    onAreaImageRemove: handleAreaImageRemove,
    onAreaImagesSelect: handleAreaImagesSelect,
    handleAreaImageUpload,
    
    // Property content methods
    refreshData: propertyContentHook.refreshData,
    pendingChanges: propertyContentHook.pendingChanges,
    setPendingChanges: propertyContentHook.setPendingChanges,
    savePropertyData: propertyContentHook.savePropertyData,
    isSaving: propertyContentHook.isSaving,
    
    // Image methods
    handleImageUpload,
    handleRemoveImage,
    images,
    isUploading,
    
    // Floorplan methods
    handleFloorplanUpload: floorplanHooks.handleFloorplanUpload,
    handleRemoveFloorplan: floorplanHooks.handleRemoveFloorplan,
    isUploadingFloorplan: floorplanHooks.isUploadingFloorplan,
    handleFloorplanEmbedScriptUpdate,
    
    // Area photos methods
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    
    // Featured image methods
    handleSetFeaturedImage: coverImageHooks.handleSetFeaturedImage,
    handleToggleFeaturedImage: coverImageHooks.handleToggleFeaturedImage,
    
    // Media update methods
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    
    // Save handlers
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    
    // Step navigation
    currentStep,
    handleStepClick,
    
    // Stub properties to maintain compatibility
    lastSaved: null,
    onSubmit: () => {}
  };
}
