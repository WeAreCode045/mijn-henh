
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useImageUploadHandler } from "./images/uploads/useImageUploadHandler";
import { useImageRemoveHandler } from "./images/uploads/useImageRemoveHandler";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { usePropertyMainImages } from "./images/usePropertyMainImages";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // When component loads, fetch the featured and grid images from database
  useEffect(() => {
    if (formData.id) {
      fetchImageSettings(formData.id);
    }
  }, [formData.id]);
  
  // Fetch featured and grid images based on database columns
  const fetchImageSettings = async (propertyId: string) => {
    try {
      // Get images marked as featured or grid
      const { data, error } = await supabase
        .from('property_images')
        .select('url, is_featured, is_grid_image')
        .eq('property_id', propertyId)
        .or('is_featured.eq.true,is_grid_image.eq.true');
        
      if (error) {
        console.error('Error fetching image settings:', error);
        return;
      }
      
      // Process the data
      const featuredImage = data.find(img => img.is_featured)?.url || null;
      const gridImages = data.filter(img => img.is_grid_image).map(img => img.url);
      
      // Update form data with these settings
      setFormData({
        ...formData,
        featuredImage,
        gridImages
      });
      
      console.log('Loaded featured/grid images from database:', { featuredImage, gridImages });
    } catch (error) {
      console.error('Error in fetchImageSettings:', error);
    }
  };
  
  // Handlers for regular property images
  const { handleImageUpload } = useImageUploadHandler(formData, setFormData, setIsUploading);
  const { handleRemoveImage } = useImageRemoveHandler(formData, setFormData);
  
  // Handler for area photos
  const { 
    handleAreaPhotosUpload, 
    handleRemoveAreaPhoto
  } = usePropertyAreaPhotos(formData, setFormData);
  
  // Handlers for floorplans
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan
  } = usePropertyFloorplans(formData, setFormData);
  
  // Handlers for featured and grid images
  const {
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyMainImages(formData, setFormData);
  
  return {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    isUploading,
    images: formData.images || []
  };
}
