
import type { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFeaturedImage(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleSetFeaturedImage = async (url: string | null) => {
    console.log("handleSetFeaturedImage called with url:", url);
    
    // Update the form data with the new featured image
    setFormData({
      ...formData,
      featuredImage: url
    });
    
    // If we have a property ID, update the database
    if (formData.id) {
      try {
        console.log("Updating featured image in database for property:", formData.id);
        const { error } = await supabase
          .from('properties')
          .update({ featuredImage: url })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error updating featured image in database:", error);
          throw error;
        }
        
        console.log("Successfully updated featured image in database");
      } catch (error) {
        console.error('Error updating featured image:', error);
        // Continue without showing error to user as local state is already updated
      }
    }
  };

  const handleToggleGridImage = async (url: string) => {
    // Ensure gridImages is always an array
    const currentGridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    
    // If the image is already in the grid, remove it, otherwise add it
    const newGridImages = currentGridImages.includes(url)
      ? currentGridImages.filter(img => img !== url)
      : [...currentGridImages, url];
    
    // Limit to max 4 grid images
    const limitedGridImages = newGridImages.slice(0, 4);
    
    // Update local state
    setFormData({
      ...formData,
      gridImages: limitedGridImages
    });
    
    // If we have a property ID, update the database
    if (formData.id) {
      try {
        const { error } = await supabase
          .from('properties')
          .update({ gridImages: limitedGridImages })
          .eq('id', formData.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating grid images:', error);
        // Continue without showing error to user as local state is already updated
      }
    }
    
    const action = currentGridImages.includes(url) ? "removed from" : "added to";
    toast({
      title: "Success",
      description: `Image ${action} grid`,
    });
  };

  const isInGridImages = (url: string): boolean => {
    const gridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    return gridImages.includes(url);
  };

  const isFeaturedImage = (url: string): boolean => {
    return formData.featuredImage === url;
  };

  return {
    handleSetFeaturedImage,
    handleToggleGridImage,
    isInGridImages,
    isFeaturedImage
  };
}
