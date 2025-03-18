
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertToPropertyImageArray } from "@/utils/propertyDataAdapters";
import { getImageUrl } from "@/utils/imageTypeConverters";

/**
 * Hook for removing images from a property
 */
export function useRemoveImage(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Remove image
  const handleRemoveImage = async (index: number) => {
    if (!property.id || !property.images || index < 0 || index >= property.images.length) return;
    
    setIsSaving(true);
    try {
      const imageToRemove = property.images[index];
      const imageUrl = getImageUrl(imageToRemove);
      const imageId = typeof imageToRemove === 'object' ? imageToRemove.id : null;
      
      // Delete from database if we have an ID
      if (imageId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageId);
          
        if (error) throw error;
      } else if (imageUrl) {
        // Try to delete by URL if we don't have an ID
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', property.id)
          .eq('url', imageUrl);
          
        if (error) throw error;
      }
      
      // Update local state - use type assertion to ensure proper typing
      const newImages = property.images.filter((_, i) => i !== index);
      
      setProperty(prev => {
        // Use the convertToPropertyImageArray helper to ensure proper typing
        const updatedImages = convertToPropertyImageArray(newImages);
        
        // Check if the removed image was a featured image
        const removedImageUrl = getImageUrl(imageToRemove);
        
        return {
          ...prev,
          images: updatedImages,
          // If the removed image was the featured image, clear it
          featuredImage: prev.featuredImage === removedImageUrl ? null : prev.featuredImage,
          // Remove from featured images if present
          featuredImages: prev.featuredImages.filter(img => getImageUrl(img) !== removedImageUrl)
        };
      });
      
      // Call handler if provided
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Image removed");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleRemoveImage };
}
