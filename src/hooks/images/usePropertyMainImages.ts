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

  // Toggle whether an image is in the cover images
  const handleToggleCoverImage = async (url: string) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // Check if the image is already in the cover images
      const isInCover = formData.coverImages?.includes(url) || false;
      
      // Toggle the is_grid_image flag in the database (keeping the database field name)
      await supabase
        .from('property_images')
        .update({ is_grid_image: !isInCover })
        .eq('property_id', formData.id)
        .eq('url', url);
      
      // Update local state with the new terminology
      setFormData(prevState => {
        const currentCoverImages = prevState.coverImages || [];
        const updatedCoverImages = isInCover
          ? currentCoverImages.filter(img => img !== url)
          : [...currentCoverImages, url];
        
        return {
          ...prevState,
          coverImages: updatedCoverImages
        };
      });
      
      toast({
        title: "Success",
        description: isInCover 
          ? "Image removed from cover." 
          : "Image added to cover."
      });
    } catch (error) {
      console.error("Error toggling cover image:", error);
      toast({
        title: "Error",
        description: "Failed to update cover image.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleCoverImage,
    isUpdating
  };
}
