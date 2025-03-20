
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/usePropertyFormState';
import { usePropertyFeatures } from './usePropertyFeatures';
import { usePropertyAreas } from './usePropertyAreas';
import { usePropertyContent } from './usePropertyContent';
import { usePropertyImages } from './usePropertyImages';
import { usePropertySaveHandlers } from './usePropertySaveHandlers';

export function usePropertyFormManager(property: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(property);
  
  // Hook for handling form state
  const { 
    onFieldChange 
  } = usePropertyFormState(formState, setFormState);
  
  // Hook for managing features
  const { 
    addFeature, 
    removeFeature, 
    updateFeature 
  } = usePropertyFeatures(formState, onFieldChange);
  
  // Hook for managing areas
  const { 
    addArea, 
    removeArea, 
    updateArea, 
    handleAreaImageRemove, 
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading
  } = usePropertyAreas(formState, onFieldChange);
  
  // Hook for managing content and steps
  const { 
    fetchLocationData,
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    lastSaved,
    isSaving,
    setPendingChanges,
    onSubmit
  } = usePropertyContent(formState, onFieldChange);
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(formState, onFieldChange);
  
  // Hook for property save handlers
  const {
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  } = usePropertySaveHandlers(formState, onFieldChange);
  
  return {
    formState,
    handleFieldChange: onFieldChange,
    
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
    
    // Location methods
    onFetchLocationData: fetchLocationData,
    onFetchCategoryPlaces: fetchCategoryPlaces,
    onFetchNearbyCities: fetchNearbyCities,
    onGenerateLocationDescription: generateLocationDescription,
    onGenerateMap: generateMapImage,
    onRemoveNearbyPlace: removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    
    // Step navigation
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    
    // Status
    lastSaved,
    isSaving,
    setPendingChanges,
    
    // Image methods
    handleImageUpload,
    handleRemoveImage,
    images,
    isUploading,
    
    // Methods that now return Promises
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  };
}
