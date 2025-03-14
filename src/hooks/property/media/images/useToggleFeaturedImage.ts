
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for toggling an image as featured/grid image
 */
export function useToggleFeaturedImage(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Toggle featured image
  const handleToggleFeaturedImage = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const featuredImages = property.featuredImages || [];
      const isAlreadyFeatured = featuredImages.includes(url);
      
      // Check max featured images limit
      if (!isAlreadyFeatured && featuredImages.length >= 4) {
        toast.warning("Maximum of 4 featured images allowed. Please remove one first.");
        setIsSaving(false);
        return;
      }
      
      // Find the image record to update
      const { data: imageRecord, error: findError } = await supabase
        .from('property_images')
        .select('id')
        .eq('property_id', property.id)
        .eq('url', url)
        .single();
        
      if (findError) {
        console.error("Error finding image record:", findError);
        throw findError;
      }
      
      if (!imageRecord) {
        throw new Error("Image record not found");
      }
      
      // Update database with the toggle state
      const { error } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isAlreadyFeatured })
        .eq('id', imageRecord.id);
        
      if (error) {
        console.error("Error toggling featured image:", error);
        throw error;
      }
      
      // Update local state
      const newFeaturedImages = isAlreadyFeatured
        ? featuredImages.filter(img => img !== url)
        : [...featuredImages, url];
        
      setProperty(prev => ({
        ...prev,
        featuredImages: newFeaturedImages
      }));
      
      // Call handler if provided
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success(isAlreadyFeatured 
        ? "Image removed from featured images" 
        : "Image added to featured images");
    } catch (error) {
      console.error("Error toggling featured image:", error);
      toast.error("Failed to update featured images");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleToggleFeaturedImage };
}
