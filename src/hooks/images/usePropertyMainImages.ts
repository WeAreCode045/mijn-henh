
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

  // Set an image as the featured image
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
          description: "Featured image updated successfully."
        });
      } else {
        // If url is null, just clear the featured image
        setFormData(prevState => ({
          ...prevState,
          featuredImage: null
        }));
      }
    } catch (error) {
      console.error("Error updating featured image:", error);
      toast({
        title: "Error",
        description: "Failed to update featured image.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle whether an image is in the grid
  const handleToggleGridImage = async (url: string) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // Check if the image is already in the grid
      const isInGrid = formData.gridImages?.includes(url) || false;
      
      // Toggle the is_grid_image flag in the database
      await supabase
        .from('property_images')
        .update({ is_grid_image: !isInGrid })
        .eq('property_id', formData.id)
        .eq('url', url);
      
      // Update local state
      setFormData(prevState => {
        const currentGridImages = prevState.gridImages || [];
        const updatedGridImages = isInGrid
          ? currentGridImages.filter(img => img !== url)
          : [...currentGridImages, url];
        
        return {
          ...prevState,
          gridImages: updatedGridImages
        };
      });
      
      toast({
        title: "Success",
        description: isInGrid 
          ? "Image removed from grid." 
          : "Image added to grid."
      });
    } catch (error) {
      console.error("Error toggling grid image:", error);
      toast({
        title: "Error",
        description: "Failed to update grid image.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleGridImage,
    isUpdating
  };
}
