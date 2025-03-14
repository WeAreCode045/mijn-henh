
import { useState, useCallback } from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { v4 as uuidv4 } from "uuid";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFormManager(property: PropertyData) {
  const [formState, setFormState] = useState<PropertyFormData>(property as PropertyFormData);
  
  // Create a callback function to update form state
  const handleFieldChange = useCallback(<K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  // Use the property content hook
  const contentManager = usePropertyContent(formState, handleFieldChange);
  
  // Use the property images hook
  const imageManager = usePropertyImages(formState, setFormState);
  
  // Use the property areas hook
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload: baseHandleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect
  } = usePropertyAreas(formState, setFormState);

  // Wrap the handleAreaImageUpload to return a Promise
  const handleAreaImageUpload = async (areaId: string, files: FileList): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        baseHandleAreaImageUpload(areaId, files);
        resolve();
      } catch (error) {
        console.error("Error uploading area images:", error);
        reject(error);
      }
    });
  };

  // Add handle functions for object_id, agent, and template
  const handleSaveObjectId = useCallback((objectId: string) => {
    handleFieldChange('object_id', objectId);
  }, [handleFieldChange]);

  const handleSaveAgent = useCallback((agentId: string) => {
    handleFieldChange('agent_id', agentId);
  }, [handleFieldChange]);

  const handleSaveTemplate = useCallback((templateId: string) => {
    handleFieldChange('template_id', templateId);
  }, [handleFieldChange]);

  // Handle setting and toggling the featured image
  const handleSetFeaturedImage = useCallback((url: string | null) => {
    if (url) {
      setFormState(prev => ({
        ...prev,
        featuredImage: url
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        featuredImage: null
      }));
    }
  }, []);

  const handleToggleFeaturedImage = useCallback((url: string) => {
    const currentFeaturedImages = formState.featuredImages || [];
    const newFeaturedImages = currentFeaturedImages.includes(url) 
      ? currentFeaturedImages.filter(img => img !== url)
      : [...currentFeaturedImages, url];
    
    handleFieldChange('featuredImages', newFeaturedImages);
  }, [formState.featuredImages, handleFieldChange]);

  // Handle area photos
  const handleAreaPhotosUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Implementation here
      console.log("Uploading area photos:", e.target.files);
    }
  }, []);

  const handleRemoveAreaPhoto = useCallback((areaId: string, imageId: string) => {
    handleAreaImageRemove(areaId, imageId);
  }, [handleAreaImageRemove]);

  // Add handlers for virtual tours and YouTube 
  const handleVirtualTourUpdate = useCallback((url: string) => {
    handleFieldChange('virtualTourUrl', url);
  }, [handleFieldChange]);

  const handleYoutubeUrlUpdate = useCallback((url: string) => {
    handleFieldChange('youtubeUrl', url);
  }, [handleFieldChange]);

  const handleFloorplanEmbedScriptUpdate = useCallback((script: string) => {
    handleFieldChange('floorplanEmbedScript', script);
  }, [handleFieldChange]);

  // Ensure propertyWithRequiredProps has all the required properties
  const propertyWithRequiredProps: PropertyData = {
    ...formState,
    id: formState.id || uuidv4(),
    title: formState.title || '',
  };

  return {
    formState,
    handleFieldChange,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    addFeature: contentManager.addFeature,
    removeFeature: contentManager.removeFeature,
    updateFeature: contentManager.updateFeature,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    handleImageUpload: imageManager.handleImageUpload,
    handleRemoveImage: imageManager.handleRemoveImage,
    isUploading: imageManager.isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload: imageManager.handleFloorplanUpload,
    handleRemoveFloorplan: imageManager.handleRemoveFloorplan,
    isUploadingFloorplan: imageManager.isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    onSubmit: contentManager.onSubmit,
    currentStep: contentManager.currentStep,
    handleStepClick: contentManager.handleStepClick,
    propertyWithRequiredProps,
    lastSaved: contentManager.lastSaved,
    isSaving: contentManager.isSaving,
    setPendingChanges: contentManager.setPendingChanges
  };
}
