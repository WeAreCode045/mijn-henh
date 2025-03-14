
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for handling setting the main/featured image of a property
 */
export function useSetFeaturedImage(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Set featured image (main image)
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // First, unmark all images as main
      const { error: resetError } = await supabase
        .from('property_images')
        .update({ is_main: false })
        .eq('property_id', property.id);
        
      if (resetError) throw resetError;
      
      if (url) {
        console.log("Setting main image:", url);
        // Mark the selected image as main
        const { error: updateError } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', property.id)
          .eq('url', url);
          
        if (updateError) {
          console.error("Error setting main image:", updateError);
          throw updateError;
        }
          
        // Update local state
        setProperty(prev => ({
          ...prev,
          featuredImage: url
        }));
        
        // Call handler if provided
        if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
        
        toast.success("Main image updated successfully");
      } else {
        // If url is null, just clear the main image
        setProperty(prev => ({
          ...prev,
          featuredImage: null
        }));
        
        // Call handler if provided
        if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
        
        toast.success("Main image cleared");
      }
    } catch (error) {
      console.error("Error updating main image:", error);
      toast.error("Failed to update main image");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSetFeaturedImage };
}
