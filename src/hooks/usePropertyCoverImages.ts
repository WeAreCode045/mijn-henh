
import { useState } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, normalizeImage } from "@/utils/imageHelpers";

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Set featured image (main image)
  const handleSetFeaturedImage = async (imageUrl: string | null) => {
    if (!formData.id) return;
    
    try {
      setIsUpdating(true);
      
      // Find the image in the images array
      const image = Array.isArray(formData.images) 
        ? formData.images.find(img => {
            const url = typeof img === 'string' ? img : img.url;
            return url === imageUrl;
          })
        : null;
      
      if (!image && imageUrl !== null) {
        console.error('Image not found in images array');
        return;
      }
      
      // Update the database: reset all images to is_main=false
      const { error: resetError } = await supabase
        .from('property_images')
        .update({ is_main: false })
        .eq('property_id', formData.id);
        
      if (resetError) {
        throw resetError;
      }
      
      // If we're setting a new featured image (not clearing)
      if (imageUrl && image) {
        const imageId = typeof image === 'string' ? null : image.id;
        
        if (imageId) {
          // Set the selected image to is_main=true
          const { error } = await supabase
            .from('property_images')
            .update({ is_main: true })
            .eq('id', imageId)
            .eq('property_id', formData.id);
            
          if (error) {
            throw error;
          }
        }
      }
      
      // Update local state
      setFormData({
        ...formData,
        featuredImage: imageUrl,
        // Ensure coverImages is an array of PropertyImage objects
        coverImages: formData.featuredImages?.map(url => normalizeImage(url)) || []
      });
      
      toast({
        title: "Success",
        description: "Featured image updated",
      });
    } catch (error) {
      console.error('Error setting featured image:', error);
      toast({
        title: "Error",
        description: "Failed to update featured image",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle featured image (grid image)
  const handleToggleFeaturedImage = async (imageUrl: string) => {
    if (!formData.id) return;
    
    try {
      setIsUpdating(true);
      
      // Find the image in the images array
      const image = Array.isArray(formData.images) 
        ? formData.images.find(img => {
            const url = typeof img === 'string' ? img : img.url;
            return url === imageUrl;
          })
        : null;
      
      if (!image) {
        console.error('Image not found in images array');
        return;
      }
      
      const imageId = typeof image === 'string' ? null : image.id;
      
      if (!imageId) {
        console.error('Image ID not found');
        return;
      }
      
      // Check if this image is already a featured image
      const isFeatured = formData.featuredImages?.includes(imageUrl) || false;
      
      // Update the database
      const { error } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isFeatured })
        .eq('id', imageId)
        .eq('property_id', formData.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedFeaturedImages = isFeatured
        ? (formData.featuredImages || []).filter(url => url !== imageUrl)
        : [...(formData.featuredImages || []), imageUrl];
      
      setFormData({
        ...formData,
        featuredImages: updatedFeaturedImages,
        // Ensure coverImages is an array of PropertyImage objects
        coverImages: updatedFeaturedImages.map(url => normalizeImage(url))
      });
      
      toast({
        title: "Success",
        description: isFeatured ? "Image removed from featured list" : "Image added to featured list",
      });
    } catch (error) {
      console.error('Error toggling featured image:', error);
      toast({
        title: "Error",
        description: "Failed to update featured images",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUpdating
  };
}
