
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
    
    // Create a copy of the images array without the removed image
    const updatedImages = formData.images.filter((_, i) => i !== index);
    
    // Update the featured image if it was removed
    let updatedFeaturedImage = formData.featuredImage;
    if (formData.featuredImage === imageToRemove.url) {
      updatedFeaturedImage = null;
    }
    
    // Update grid images if they include the removed image
    const updatedGridImages = (formData.gridImages || []).filter(url => url !== imageToRemove.url);
    
    // Create an updated form data object
    const updatedFormData = {
      ...formData,
      images: updatedImages,
      featuredImage: updatedFeaturedImage,
      gridImages: updatedGridImages
    };
    
    // Update the form state
    setFormData(updatedFormData);
    
    // Attempt to delete the file from storage if file path exists
    if (imageToRemove.filePath) {
      try {
        const { error } = await supabase.storage
          .from('properties')
          .remove([imageToRemove.filePath]);
          
        if (error) {
          console.error('Error deleting image from storage:', error);
        }
      } catch (error) {
        console.error('Error in file deletion process:', error);
      }
    }
    
    // If property exists in database, update the property_images table
    if (formData.id && imageToRemove.url) {
      try {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('url', imageToRemove.url)
          .eq('property_id', formData.id)
          .eq('type', 'image');
          
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
