
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/components/property/form/usePropertyFormState';
import { usePropertyContent } from './property-form/usePropertyContent';
import { usePropertyFeatures } from './property-form/usePropertyFeatures';
import { usePropertyAreas } from './property-form/usePropertyAreas';

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
    handleAreaImageUpload
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
  
  return {
    formState,
    onFieldChange,
    
    // Feature methods
    addFeature,
    removeFeature,
    updateFeature,
    
    // Area methods
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
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
    setPendingChanges
  };
}
