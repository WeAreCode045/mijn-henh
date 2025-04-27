
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
  
  // Create wrapper functions for handlers that expect different parameter types
  const handleImageUploadWrapper = (files: FileList) => {
    // Create a synthetic event-like object with the files
    const eventMock = { target: { files } };
    return formManager.handleImageUpload(eventMock as any);
  };

  const handleRemoveImageWrapper = (imageUrl: string) => {
    // Find the image index by URL and remove it
    const index = formManager.images.findIndex(img => 
      typeof img === 'string' ? img === imageUrl : img.url === imageUrl
    );
    if (index !== -1) {
      formManager.handleRemoveImage(index);
    }
  };

  const handleAreaPhotosUploadWrapper = (files: FileList) => {
    // Create a synthetic event-like object with the files
    const eventMock = { target: { files } };
    return formManager.handleImageUpload(eventMock as any);
  };

  const handleFloorplanUploadWrapper = (files: FileList) => {
    // Create a synthetic event-like object with the files
    const eventMock = { target: { files } };
    return formManager.handleFloorplanUpload(eventMock as any);
  };

  const handleRemoveFloorplanWrapper = (floorplanId: string) => {
    // Find the floorplan index by ID and remove it
    const floorplans = formManager.formState.floorplans || [];
    const index = floorplans.findIndex((fp: any) => 
      typeof fp === 'string' ? fp === floorplanId : fp.id === floorplanId
    );
    if (index !== -1) {
      formManager.handleRemoveFloorplan(index);
    }
  };
  
  // Create the props object to pass to children
  const childrenProps: PropertyFormManagerChildrenProps = {
    formState: formManager.formState,
    formData: formManager.formState, // Add formData prop
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
    handleImageUpload: handleImageUploadWrapper,
    handleRemoveImage: handleRemoveImageWrapper,
    isUploading: formManager.isUploading,
    handleAreaPhotosUpload: handleAreaPhotosUploadWrapper,
    handleRemoveAreaPhoto: formManager.onAreaImageRemove,
    handleFloorplanUpload: handleFloorplanUploadWrapper,
    handleRemoveFloorplan: handleRemoveFloorplanWrapper,
    isUploadingFloorplan: formManager.isUploadingFloorplan,
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
    images: formManager.images.map(img => typeof img === 'string' ? img : img.url) // Convert PropertyImage[] to string[]
  };
  
  return children(childrenProps);
}
