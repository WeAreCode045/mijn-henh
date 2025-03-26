
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/usePropertyFormState';
import { usePropertyFeatures } from './property-form/usePropertyFeatures';
import { usePropertyAreas } from './property-form/usePropertyAreas';
import { usePropertyContent } from './property-form/usePropertyContent';
import { usePropertyImages } from './property-form/usePropertyImages';
import { usePropertySaveHandlers } from './property-form/usePropertySaveHandlers';

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
  
  // We need to create proper mock implementations for these functions
  // that are expected by the component but not actually implemented in usePropertyImages
  const mockHandlers = {
    handleFloorplanUpload: async () => { console.log('Mock handleFloorplanUpload called') },
    handleRemoveFloorplan: () => { console.log('Mock handleRemoveFloorplan called') },
    isUploadingFloorplan: false,
    handleSetFeaturedImage: () => { console.log('Mock handleSetFeaturedImage called') },
    handleToggleFeaturedImage: () => { console.log('Mock handleToggleFeaturedImage called') },
    handleVirtualTourUpdate: () => { console.log('Mock handleVirtualTourUpdate called') },
    handleYoutubeUrlUpdate: () => { console.log('Mock handleYoutubeUrlUpdate called') },
    handleFloorplanEmbedScriptUpdate: () => { console.log('Mock handleFloorplanEmbedScriptUpdate called') }
  };
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(property.id || '', formState, onFieldChange);
  
  // Hook for property save handlers
  const {
    handleSaveObjectId,
    handleSaveAgent
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
    
    // Mock implementations for expected but missing methods
    ...mockHandlers,
    
    // Methods that now return Promises
    handleSaveObjectId,
    handleSaveAgent
  };
}
