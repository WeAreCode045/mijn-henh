
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyImage } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { toPropertyImage } from '@/utils/imageTypeConverters';

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Set an image as the main image (previously featured image)
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // First, unmark all images as main
      const { error: resetError } = await supabase
        .from('property_images')
        .update({ is_main: false })
        .eq('property_id', formData.id);
        
      if (resetError) {
        throw resetError;
      }
      
      if (url) {
        // Mark the selected image as main
        const { error: updateError } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', formData.id)
          .eq('url', url);
          
        if (updateError) {
          throw updateError;
        }
          
        // Update local state
        setFormData(prevState => ({
          ...prevState,
          featuredImage: url
        }));
        
        toast.success("Main image updated successfully.");
      } else {
        // If url is null, just clear the main image
        setFormData(prevState => ({
          ...prevState,
          featuredImage: null
        }));
      }
    } catch (error) {
      console.error("Error updating main image:", error);
      toast.error("Failed to update main image.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle whether an image is in the featured images collection
  const handleToggleFeaturedImage = async (url: string) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // Convert featuredImages to PropertyImage objects if they're strings
      const currentFeaturedImages = (formData.featuredImages || []).map(img => 
        typeof img === 'string' ? toPropertyImage(img) : img
      );
      
      // Check if the image is already in the featured images
      const isInFeatured = currentFeaturedImages.some(img => img.url === url);
      
      if (!isInFeatured) {
        // Check if we already have 4 featured images
        if (currentFeaturedImages.length >= 4) {
          // Remove the oldest featured image
          const oldestFeaturedImage = currentFeaturedImages[0];
          
          // Unmark it in the database
          const { error: resetError } = await supabase
            .from('property_images')
            .update({ is_featured_image: false })
            .eq('property_id', formData.id)
            .eq('url', oldestFeaturedImage.url);
            
          if (resetError) {
            throw resetError;
          }
        }
      }
      
      // Toggle the is_featured_image flag in the database
      const { error: updateError } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isInFeatured })
        .eq('property_id', formData.id)
        .eq('url', url);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setFormData(prevState => {
        // Convert featuredImages to PropertyImage objects if they're strings
        const prevFeaturedImages = (prevState.featuredImages || []).map(img => 
          typeof img === 'string' ? toPropertyImage(img) : img
        );
        
        let updatedFeaturedImages: PropertyImage[];
        
        if (isInFeatured) {
          // Remove from featured
          updatedFeaturedImages = prevFeaturedImages.filter(img => img.url !== url);
        } else {
          // Add to featured, maintaining max 4 images
          updatedFeaturedImages = [...prevFeaturedImages, toPropertyImage(url)];
          if (updatedFeaturedImages.length > 4) {
            updatedFeaturedImages = updatedFeaturedImages.slice(1); // Remove oldest
          }
        }
        
        return {
          ...prevState,
          featuredImages: updatedFeaturedImages,
          // Update legacy fields for backward compatibility
          coverImages: updatedFeaturedImages
        };
      });
      
      toast.success(isInFeatured 
        ? "Image removed from featured images." 
        : "Image added to featured images.");
    } catch (error) {
      console.error("Error toggling featured image:", error);
      toast.error("Failed to update featured image.");
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
