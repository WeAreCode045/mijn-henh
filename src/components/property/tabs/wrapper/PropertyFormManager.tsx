
import { useState, useEffect } from 'react';
import { PropertyFormManagerProps, PropertyFormManagerChildrenProps } from './types/PropertyFormManagerTypes';
import { usePropertyFormManager } from '@/hooks/property-form/usePropertyFormManager';
import { PropertyData } from '@/types/property';

export function PropertyFormManager({ property, isArchived = false, children }: PropertyFormManagerProps) {
  const [propertyState, setPropertyState] = useState(property);
  
  // Update internal state when property changes
  useEffect(() => {
    setPropertyState(property);
  }, [property]);
  
  // Use the hook to manage form state and handlers
  const formManager = usePropertyFormManager(propertyState);
  
  // Create the props object to pass to children
  const childrenProps: PropertyFormManagerChildrenProps = {
    formState: formManager.formState,
    handleFieldChange: formManager.handleFieldChange,
    handleSaveObjectId: formManager.handleSaveObjectId,
    handleSaveAgent: formManager.handleSaveAgent,
    addFeature: formManager.onAddFeature,
    removeFeature: formManager.onRemoveFeature,
    updateFeature: formManager.onUpdateFeature,
    addArea: formManager.onAddArea,
    removeArea: formManager.onRemoveArea,
    updateArea: formManager.onUpdateArea,
    handleAreaImageRemove: formManager.onAreaImageRemove,
    handleAreaImagesSelect: formManager.onAreaImagesSelect,
    handleAreaImageUpload: formManager.handleAreaImageUpload,
    handleImageUpload: formManager.handleImageUpload,
    handleRemoveImage: formManager.handleRemoveImage,
    isUploading: formManager.isUploading,
    handleAreaPhotosUpload: formManager.handleImageUpload, // Use the correct handler
    handleRemoveAreaPhoto: formManager.handleAreaImageRemove,
    handleFloorplanUpload: formManager.handleFloorplanUpload,
    handleRemoveFloorplan: formManager.handleRemoveImage,
    isUploadingFloorplan: formManager.isUploading,
    handleSetFeaturedImage: formManager.handleSetFeaturedImage,
    handleToggleFeaturedImage: formManager.handleToggleFeaturedImage,
    onSubmit: formManager.onSubmit,
    currentStep: formManager.currentStep,
    handleStepClick: formManager.handleStepClick,
    propertyWithRequiredProps: property as PropertyData,
    lastSaved: formManager.lastSaved,
    isSaving: formManager.isSaving,
    setPendingChanges: formManager.setPendingChanges,
    // Location handlers
    onFetchLocationData: formManager.onFetchLocationData,
    onFetchCategoryPlaces: formManager.onFetchCategoryPlaces,
    onFetchNearbyCities: formManager.onFetchNearbyCities,
    onGenerateLocationDescription: formManager.onGenerateLocationDescription,
    onGenerateMap: formManager.onGenerateMap,
    onRemoveNearbyPlace: formManager.onRemoveNearbyPlace,
    isLoadingLocationData: formManager.isLoadingLocationData,
    isGeneratingMap: formManager.isGeneratingMap,
    // Media handlers
    handleVirtualTourUpdate: formManager.handleVirtualTourUpdate,
    handleYoutubeUrlUpdate: formManager.handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate: formManager.handleFloorplanEmbedScriptUpdate,
    // Backward compatibility
    onAddFeature: formManager.onAddFeature,
    onRemoveFeature: formManager.onRemoveFeature,
    onUpdateFeature: formManager.onUpdateFeature,
    onAddArea: formManager.onAddArea,
    onRemoveArea: formManager.onRemoveArea,
    onUpdateArea: formManager.onUpdateArea,
    onAreaImageRemove: formManager.onAreaImageRemove,
    onAreaImagesSelect: formManager.onAreaImagesSelect,
    images: formManager.images
  };
  
  return children(childrenProps);
}
