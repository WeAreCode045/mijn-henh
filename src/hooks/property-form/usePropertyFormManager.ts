
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/property-form/usePropertyFormState';
import { usePropertyFeatures } from './usePropertyFeatures';
import { usePropertyAreas } from './usePropertyAreas';
import { usePropertyContent } from '../usePropertyContent';
import { usePropertyImages } from './usePropertyImages';
import { usePropertySaveHandlers } from './usePropertySaveHandlers';

export function usePropertyFormManager(property: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(property);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Hook for handling form state
  const { 
    formState: formStateFromHook, 
    handleFieldChange 
  } = usePropertyFormState(formState, setPendingChanges);
  
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
  
  // Hook for managing content and steps
  const { 
    fetchLocationData,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    fetchCategoryPlaces,
    fetchNearbyCities,
    isLoadingLocationData,
    isGeneratingMap,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    lastSaved,
    isSaving,
    setPendingChanges: setContentPendingChanges,
    onSubmit
  } = usePropertyContent(formState, handleFieldChange);
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(formState, handleFieldChange);
  
  // Hook for property save handlers
  const {
    handleSaveObjectId,
    handleSaveAgent
  } = usePropertySaveHandlers(formState, handleFieldChange);
  
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
    handleSaveAgent
  };
}
