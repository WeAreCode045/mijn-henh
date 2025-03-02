
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { usePropertyMainImages } from "./images/usePropertyMainImages";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";
import { usePropertyFeaturedImage } from "./images/usePropertyFeaturedImage";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { handleImageUpload, handleRemoveImage, isUploading, images, fetchImages } = usePropertyMainImages(formData, setFormData);
  const { handleAreaPhotosUpload, handleRemoveAreaPhoto } = usePropertyAreaPhotos(formData, setFormData);
  const { handleFloorplanUpload, handleRemoveFloorplan, handleUpdateFloorplan, handleUpdateFloorplanEmbedScript } = usePropertyFloorplans(formData, setFormData);
  const { handleSetFeaturedImage, handleToggleGridImage, isInGridImages, isFeaturedImage } = usePropertyFeaturedImage(formData, setFormData);

  // Function to fetch floorplans from property_images table
  const fetchFloorplans = async (propertyId: string) => {
    if (!propertyId) return [];
    
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform to PropertyFloorplan format
      const floorplans: PropertyFloorplan[] = (data || []).map(item => ({
        id: item.id,
        url: item.url,
        columns: 1
      }));
      
      return floorplans;
    } catch (error) {
      console.error('Error fetching property floorplans:', error);
      return [];
    }
  };

  // Load images and floorplans when property ID changes
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
          floorplans: [...(formData.floorplans || []), ...floorplanData]
        });
      };
      
      loadMediaData();
    }
  }, [formData?.id]);

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage,
    isInGridImages,
    isFeaturedImage,
    images: formData?.images || [],
    fetchImages,
    fetchFloorplans
  };
}
