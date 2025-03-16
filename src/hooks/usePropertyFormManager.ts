
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/usePropertyFormState';
import { usePropertyFeatures } from './property-form/usePropertyFeatures';
import { usePropertyAreas } from './property-form/usePropertyAreas';
import { usePropertyContent } from './property-form/usePropertyContent';
import { usePropertyImages } from './property-form/usePropertyImages';
import { usePropertyFloorplans } from './images/usePropertyFloorplans';
import { usePropertyAreaPhotos } from './images/usePropertyAreaPhotos';
import { usePropertyCoverImages } from './usePropertyCoverImages';

// Define a wrapper for handleFieldChange
const createFieldChangeWrapper = (handleFieldChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void) => {
  return (data: PropertyFormData) => {
    // For each property in data, call handleFieldChange
    Object.entries(data).forEach(([key, value]) => {
      handleFieldChange(key as keyof PropertyFormData, value as any);
    });
  };
};

export function usePropertyFormManager(property: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(property);
  
  // Hook for handling form state
  const { 
    handleFieldChange 
  } = usePropertyFormState(formState, setFormState);
  
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
  
  // Create a wrapper function for hooks that expect a function with (data: PropertyFormData) signature
  const fieldChangeWrapper = createFieldChangeWrapper(handleFieldChange);
  
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
  } = usePropertyContent(formState, handleFieldChange);
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(formState, handleFieldChange);
  
  // Get the floorplan hooks but create a stub for missing methods
  const floorplanHooks = usePropertyFloorplans(formState, fieldChangeWrapper);
  
  // Create a stub for handleFloorplanEmbedScriptUpdate if it doesn't exist
  const handleFloorplanEmbedScriptUpdate = floorplanHooks.handleFloorplanEmbedScriptUpdate || 
    ((script: string) => {
      handleFieldChange('floorplanEmbedScript', script);
    });
  
  // Hook for managing area photos
  const {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto
  } = usePropertyAreaPhotos(formState, setFormState);
  
  // Get the cover image hooks but create stubs for missing methods
  const coverImageHooks = usePropertyCoverImages(formState, fieldChangeWrapper);
  
  // Create stubs for missing methods
  const handleSetFeaturedImage = coverImageHooks.handleSetFeaturedImage || 
    ((url: string | null) => {
      handleFieldChange('featuredImage', url);
    });
  
  const handleToggleFeaturedImage = coverImageHooks.handleToggleFeaturedImage || 
    ((url: string) => {
      const featuredImages = [...(formState.featuredImages || [])];
      if (featuredImages.includes(url)) {
        handleFieldChange('featuredImages', featuredImages.filter(img => img !== url));
      } else {
        handleFieldChange('featuredImages', [...featuredImages, url]);
      }
    });
  
  // Media update handlers
  const handleVirtualTourUpdate = (url: string) => {
    handleFieldChange('virtualTourUrl', url);
  };
  
  const handleYoutubeUrlUpdate = (url: string) => {
    handleFieldChange('youtubeUrl', url);
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
    
    // Floorplan methods
    handleFloorplanUpload: floorplanHooks.handleFloorplanUpload,
    handleRemoveFloorplan: floorplanHooks.handleRemoveFloorplan,
    isUploadingFloorplan: floorplanHooks.isUploadingFloorplan,
    handleFloorplanEmbedScriptUpdate,
    
    // Area photos methods
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    
    // Featured image methods
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    
    // Media update methods
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    
    // Save handlers
    handleSaveObjectId: (objectId: string) => {
      handleFieldChange('object_id', objectId);
    },
    handleSaveAgent: (agentId: string) => {
      handleFieldChange('agent_id', agentId);
    },
    handleSaveTemplate: (templateId: string) => {
      handleFieldChange('template_id', templateId);
    }
  };
}
