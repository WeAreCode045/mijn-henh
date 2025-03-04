import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Set an image as the main image (previously featured image)
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // First, unmark all images as featured
      await supabase
        .from('property_images')
        .update({ is_featured: false })
        .eq('property_id', formData.id);
      
      if (url) {
        // Mark the selected image as featured
        await supabase
          .from('property_images')
          .update({ is_featured: true })
          .eq('property_id', formData.id)
          .eq('url', url);
          
        // Update local state
        setFormData(prevState => ({
          ...prevState,
          featuredImage: url
        }));
        
        toast({
          title: "Success",
          description: "Main image updated successfully."
        });
      } else {
        // If url is null, just clear the featured image
        setFormData(prevState => ({
          ...prevState,
          featuredImage: null
        }));
      }
    } catch (error) {
      console.error("Error updating main image:", error);
      toast({
        title: "Error",
        description: "Failed to update main image.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle whether an image is in the featured images (previously cover images)
  const handleToggleFeaturedImage = async (url: string) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // Check if the image is already in the featured images
      const isInFeatured = formData.featuredImages?.includes(url) || false;
      
      // Toggle the is_grid_image flag in the database (keeping the database field name for now)
      await supabase
        .from('property_images')
        .update({ is_grid_image: !isInFeatured })
        .eq('property_id', formData.id)
        .eq('url', url);
      
      // Update local state with the new terminology
      setFormData(prevState => {
        const currentFeaturedImages = prevState.featuredImages || [];
        const updatedFeaturedImages = isInFeatured
          ? currentFeaturedImages.filter(img => img !== url)
          : [...currentFeaturedImages, url];
        
        return {
          ...prevState,
          featuredImages: updatedFeaturedImages,
          // Update legacy fields for backward compatibility
          coverImages: updatedFeaturedImages
        };
      });
      
      toast({
        title: "Success",
        description: isInFeatured 
          ? "Image removed from featured images." 
          : "Image added to featured images."
      });
    } catch (error) {
      console.error("Error toggling featured image:", error);
      toast({
        title: "Error",
        description: "Failed to update featured image.",
        variant: "destructive"
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
