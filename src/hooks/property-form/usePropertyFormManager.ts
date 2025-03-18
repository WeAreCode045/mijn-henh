
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
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
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

  // Mock location service functions
  const fetchLocationData = async () => {
    console.log("fetchLocationData called");
    return Promise.resolve({});
  };
  
  const fetchCategoryPlaces = async (category: string) => {
    console.log("fetchCategoryPlaces called with:", category);
    return Promise.resolve([]);
  };
  
  const fetchNearbyCities = async () => {
    console.log("fetchNearbyCities called");
    return Promise.resolve([]);
  };
  
  const generateLocationDescription = async () => {
    console.log("generateLocationDescription called");
    return Promise.resolve("");
  };
  
  const generateMapImage = async () => {
    console.log("generateMapImage called");
    return Promise.resolve("");
  };
  
  const removeNearbyPlace = (index: number) => {
    console.log("removeNearbyPlace called with:", index);
  };
  
  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };
  
  const onSubmit = () => {
    console.log("onSubmit called");
    return propertyContentHook.savePropertyData();
  };
  
  return {
    formState,
    handleFieldChange,
    
    // Feature methods
    addFeature,
    removeFeature,
    updateFeature,
    
    // Aliases for backward compatibility
    onAddFeature: addFeature,
    onRemoveFeature: removeFeature,
    onUpdateFeature: updateFeature,
    
    // Area methods
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    
    // Aliases for backward compatibility
    onAddArea: addArea,
    onRemoveArea: removeArea,
    onUpdateArea: updateArea,
    onAreaImageRemove: handleAreaImageRemove,
    onAreaImagesSelect: handleAreaImagesSelect,
    
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
    
    // Location service methods
    onFetchLocationData: fetchLocationData,
    onFetchCategoryPlaces: fetchCategoryPlaces,
    onFetchNearbyCities: fetchNearbyCities,
    onGenerateLocationDescription: generateLocationDescription,
    onGenerateMap: generateMapImage,
    onRemoveNearbyPlace: removeNearbyPlace,
    isLoadingLocationData: false,
    isGeneratingMap: false,
    
    // Step navigation
    currentStep,
    handleStepClick,
    lastSaved,
    
    // Submit handler
    onSubmit
  };
}
