
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { toPropertyImageArray } from "@/utils/imageHelpers";
import { convertToPropertyImageArray } from "@/utils/propertyDataAdapters";

export function useImageRemoveHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
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
    const imageId = typeof imageToRemove === 'string' ? null : imageToRemove.id;
    
    if (!formData.id) {
      // If we don't have a property ID yet, just update the local state
      // Create a copy of the images array without the removed image
      const updatedImages = convertToPropertyImageArray([...formData.images].filter((_, i) => i !== index));
      
      // Update the featured image if it was removed
      let updatedFeaturedImage = formData.featuredImage;
      if (formData.featuredImage === imageUrl) {
        updatedFeaturedImage = null;
      }
      
      // Update featured images if they include the removed image
      const updatedFeaturedImages = (formData.featuredImages || []).filter(url => url !== imageUrl);
      
      // Convert featuredImages to PropertyImage[] for coverImages
      const updatedCoverImages = updatedFeaturedImages.map(url => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: url,
        type: "image" as const
      })) as PropertyImage[];
      
      // Create an updated form data object with proper typing
      const updatedFormData: PropertyFormData = {
        ...formData,
        images: updatedImages,
        featuredImage: updatedFeaturedImage,
        featuredImages: updatedFeaturedImages,
        coverImages: updatedCoverImages
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      toast.success("Image removed successfully");
      return;
    }
    
    try {
      // If we have a property ID and URL, delete the image from the database
      if (formData.id && imageUrl) {
        console.log("Deleting image from database:", { imageUrl, imageId, propertyId: formData.id });
        
        // First fetch the image record to get the file path from the URL
        let filePath;
        
        if (imageId) {
          // Attempt to delete from property_images table
          const { error: deleteError } = await supabase
            .from('property_images')
            .delete()
            .eq('id', imageId);
            
          if (deleteError) {
            console.error('Error deleting image record from database:', deleteError);
            throw deleteError;
          }
        } else {
          // If we don't have an ID, try to delete by URL
          const { error: deleteError } = await supabase
            .from('property_images')
            .delete()
            .eq('url', imageUrl)
            .eq('property_id', formData.id);
            
          if (deleteError) {
            console.error('Error deleting image record from database by URL:', deleteError);
            throw deleteError;
          }
        }
        
        // Try to extract the file path from the URL
        try {
          const urlObj = new URL(imageUrl);
          const pathname = urlObj.pathname;
          // The path should be something like /storage/v1/object/public/properties/path/to/file
          // We need to extract just the "path/to/file" part
          const pathMatch = pathname.match(/\/storage\/v1\/object\/public\/properties\/(.+)/);
          if (pathMatch && pathMatch[1]) {
            filePath = decodeURIComponent(pathMatch[1]);
            
            // Attempt to delete the file from storage
            console.log("Attempting to delete file from storage:", filePath);
            const { error: storageError } = await supabase.storage
              .from('properties')
              .remove([filePath]);
              
            if (storageError) {
              console.error('Error deleting file from storage:', storageError);
              // We don't throw here as the database record has been deleted successfully
            }
          }
        } catch (parseError) {
          console.error('Error parsing image URL to get file path:', parseError);
          // Continue with state update even if storage deletion fails
        }
      }
      
      // Create a copy of the images array without the removed image
      const updatedImages = convertToPropertyImageArray([...formData.images].filter((_, i) => i !== index));
      
      // Update the featured image if it was removed
      let updatedFeaturedImage = formData.featuredImage;
      if (formData.featuredImage === imageUrl) {
        updatedFeaturedImage = null;
      }
      
      // Update featured images if they include the removed image
      const updatedFeaturedImages = (formData.featuredImages || []).filter(url => url !== imageUrl);
      
      // Convert featuredImages to PropertyImage[] for coverImages
      const updatedCoverImages = updatedFeaturedImages.map(url => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: url,
        type: "image" as const
      })) as PropertyImage[];
      
      // Create an updated form data object with proper typing
      const updatedFormData: PropertyFormData = {
        ...formData,
        images: updatedImages,
        featuredImage: updatedFeaturedImage,
        featuredImages: updatedFeaturedImages,
        coverImages: updatedCoverImages
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      // Show success toast
      toast.success("Image removed successfully");
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  return { handleRemoveImage };
}
