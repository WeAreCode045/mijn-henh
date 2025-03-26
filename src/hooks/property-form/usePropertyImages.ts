
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { v4 as uuidv4 } from 'uuid';

export function usePropertyImages(
  propertyId: string,
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);
  
  // Convert any image format to a standard PropertyImage array
  const normalizeImages = useCallback((images: any[] | undefined): PropertyImage[] => {
    if (!images) return [];
    
    return images.map(img => {
      if (typeof img === 'string') {
        return { id: uuidv4(), url: img };
      } else if (typeof img === 'object') {
        if ('url' in img) {
          return { id: img.id || uuidv4(), url: img.url };
        }
      }
      return { id: uuidv4(), url: '' };
    });
  }, []);
  
  // Get normalized images
  const images = normalizeImages(formState.images as any[]);
  
  // Handle image upload
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload the files to your server
      // For now, we'll just simulate the upload
      const uploadedImageUrls = Array.from(e.target.files).map((file, index) => ({
        id: `temp_${uuidv4()}`,
        url: URL.createObjectURL(file)
      }));
      
      // Add the uploaded images to the property
      const currentImages = normalizeImages(formState.images as any[]);
      const updatedImages = [...currentImages, ...uploadedImageUrls];
      
      handleFieldChange('images', updatedImages);
      setPendingChanges(true);
    } finally {
      setIsUploading(false);
    }
  }, [formState.images, normalizeImages, handleFieldChange, setPendingChanges]);
  
  // Remove an image
  const handleRemoveImage = useCallback((index: number) => {
    const currentImages = normalizeImages(formState.images as any[]);
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    
    handleFieldChange('images', updatedImages);
    setPendingChanges(true);
  }, [formState.images, normalizeImages, handleFieldChange, setPendingChanges]);
  
  // Handle floorplan upload
  const handleFloorplanUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingFloorplan(true);
    
    try {
      // In a real implementation, you would upload the files to your server
      // For now, we'll just simulate the upload
      const uploadedFloorplans = Array.from(e.target.files).map((file, index) => ({
        id: `floorplan_${uuidv4()}`,
        url: URL.createObjectURL(file)
      }));
      
      // Add the uploaded floorplans to the property
      const currentFloorplans = normalizeImages(formState.floorplans as any[]) || [];
      const updatedFloorplans = [...currentFloorplans, ...uploadedFloorplans];
      
      handleFieldChange('floorplans', updatedFloorplans);
      setPendingChanges(true);
    } finally {
      setIsUploadingFloorplan(false);
    }
  }, [formState.floorplans, normalizeImages, handleFieldChange, setPendingChanges]);
  
  // Remove a floorplan
  const handleRemoveFloorplan = useCallback((index: number) => {
    const currentFloorplans = normalizeImages(formState.floorplans as any[]) || [];
    const updatedFloorplans = [...currentFloorplans];
    updatedFloorplans.splice(index, 1);
    
    handleFieldChange('floorplans', updatedFloorplans);
    setPendingChanges(true);
  }, [formState.floorplans, normalizeImages, handleFieldChange, setPendingChanges]);
  
  // Set featured image
  const handleSetFeaturedImage = useCallback((imageUrl: string | null) => {
    handleFieldChange('featuredImage', imageUrl);
    setPendingChanges(true);
  }, [handleFieldChange, setPendingChanges]);
  
  // Toggle featured image
  const handleToggleFeaturedImage = useCallback((imageUrl: string) => {
    const featuredImages = formState.featuredImages || [];
    
    if (featuredImages.includes(imageUrl)) {
      handleFieldChange('featuredImages', featuredImages.filter(url => url !== imageUrl));
    } else {
      handleFieldChange('featuredImages', [...featuredImages, imageUrl]);
    }
    
    setPendingChanges(true);
  }, [formState.featuredImages, handleFieldChange, setPendingChanges]);
  
  // Update virtual tour URL
  const handleVirtualTourUpdate = useCallback((url: string) => {
    handleFieldChange('virtualTourUrl', url);
    setPendingChanges(true);
  }, [handleFieldChange, setPendingChanges]);
  
  // Update YouTube URL
  const handleYoutubeUrlUpdate = useCallback((url: string) => {
    handleFieldChange('youtubeUrl', url);
    setPendingChanges(true);
  }, [handleFieldChange, setPendingChanges]);
  
  // Update floorplan embed script
  const handleFloorplanEmbedScriptUpdate = useCallback((script: string) => {
    handleFieldChange('floorplanEmbedScript', script);
    setPendingChanges(true);
  }, [handleFieldChange, setPendingChanges]);
  
  return {
    images,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  };
}
