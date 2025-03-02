import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFeaturedImage } from "./images/usePropertyFeaturedImage";
import { useMediaUpload } from "./useMediaUpload";
import { useFloorplanUpload } from "./useFloorplanUpload";
import { useFloorplanUpdateHandler } from "./images/floorplans/useFloorplanUpdateHandler";
import { useEffect } from "react";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  // Use the separate media and floorplan hooks
  const { 
    handleImageUpload, 
    handleRemoveImage, 
    isUploading, 
    fetchImages, 
    images 
  } = useMediaUpload(formData, setFormData);
  
  const { 
    handleFloorplanUpload, 
    handleRemoveFloorplan, 
    handleUpdateFloorplanEmbedScript, 
    fetchFloorplans, 
    floorplans 
  } = useFloorplanUpload(formData, setFormData);
  
  // Add the floorplan update handler
  const { handleUpdateFloorplan } = useFloorplanUpdateHandler(formData, setFormData);
  
  // Keep existing area photos hooks 
  const { handleAreaPhotosUpload, handleRemoveAreaPhoto } = usePropertyAreaPhotos(formData, setFormData);
  
  // Keep existing featured image hooks
  const { handleSetFeaturedImage, handleToggleGridImage, isInGridImages, isFeaturedImage } = usePropertyFeaturedImage(formData, setFormData);

  // Load media when property ID changes
  useEffect(() => {
    if (formData?.id) {
      const loadMediaData = async () => {
        // Load images 
        const imageData = await fetchImages(formData.id);
        
        // Load floorplans
        const floorplanData = await fetchFloorplans(formData.id);
        
        // Update form data with fetched media
        setFormData({
          ...formData,
          images: imageData.map(img => ({
            id: img.id,
            url: img.url
          })),
          floorplans: floorplanData
        });
      };
      
      loadMediaData();
    }
  }, [formData?.id]);

  return {
    // Media handling
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    images: formData?.images || [],
    fetchImages,
    
    // Floorplan handling
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleUpdateFloorplanEmbedScript,
    fetchFloorplans,
    
    // Area photos handling
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    
    // Featured image handling
    handleSetFeaturedImage,
    handleToggleGridImage,
    isInGridImages,
    isFeaturedImage
  };
}
