
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from "@/types/property";

export function useImageRemoveHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  // This function handles the removal of images
  const handleRemoveImage = async (index: number) => {
    // Ensure images array exists
    if (!Array.isArray(formData.images) || index < 0 || index >= formData.images.length) {
      console.error('Invalid image index or images array is not defined');
      return;
    }
    
    // Get the image to be removed
    const imageToRemove = formData.images[index];
    const imageUrl = typeof imageToRemove === 'string' ? imageToRemove : imageToRemove.url;
    
    // Create a copy of the images array without the removed image
    const updatedImages = formData.images.filter((_, i) => i !== index);
    
    // Update the featured image if it was removed
    let updatedFeaturedImage = formData.featuredImage;
    if (formData.featuredImage === imageUrl) {
      updatedFeaturedImage = null;
    }
    
    // Update cover images if they include the removed image
    const updatedCoverImages = (formData.coverImages || []).filter(url => url !== imageUrl);
    
    // Create an updated form data object
    const updatedFormData = {
      ...formData,
      images: updatedImages,
      featuredImage: updatedFeaturedImage,
      coverImages: updatedCoverImages
    };
    
    // Update the form state
    setFormData(updatedFormData);
    
    // If the image has a file path, attempt to delete it from storage
    if (typeof imageToRemove !== 'string' && imageToRemove.filePath) {
      try {
        // Fix: Ensure filePath is a string before using it
        const filePath = typeof imageToRemove.filePath === 'string' ? imageToRemove.filePath : '';
        
        if (filePath) {
          const { error } = await supabase.storage
            .from('properties')
            .remove([filePath]);
            
          if (error) {
            console.error('Error deleting image from storage:', error);
          }
        }
      } catch (error) {
        console.error('Error in file deletion process:', error);
      }
    }
    
    // If property exists in database, delete the image from property_images table
    if (formData.id && imageUrl) {
      try {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('url', imageUrl)
          .eq('property_id', formData.id);
          
        if (error) {
          console.error('Error removing image from database:', error);
        }
      } catch (error) {
        console.error('Error removing image from database:', error);
      }
    }
    
    toast({
      title: "Success",
      description: "Image removed successfully",
    });
  };

  return { handleRemoveImage };
}
