
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from '@/types/property';

export function useAreaImageRemove(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Remove an image from an area (but not from the library or storage)
  const handleAreaImageRemove = async (areaId: string, imageId: string) => {
    console.log(`Removing image ${imageId} from area ${areaId}`);
    
    try {
      // Find the area to update
      const areaToUpdate = formData.areas?.find(area => area.id === areaId);
      
      if (!areaToUpdate) {
        console.error(`Area with ID ${areaId} not found`);
        throw new Error(`Area with ID ${areaId} not found`);
      }
      
      // First update the area's images in the local state
      const updatedAreas = formData.areas?.map(area => {
        if (area.id === areaId) {
          // Filter out the removed image but preserve other images
          const updatedImages = Array.isArray(area.images) 
            ? area.images.filter(img => {
                if (typeof img === 'string') {
                  return img !== imageId;
                }
                return img.id !== imageId;
              })
            : [];
            
          console.log(`Updating area ${areaId} images after removal:`, updatedImages);
          return {
            ...area,
            images: updatedImages
          };
        }
        return area;
      }) || [];
      
      // Update the form data with the modified areas
      setFormData(prevData => ({
        ...prevData,
        areas: updatedAreas
      }));
      
      // If we have a property ID, update the property_images table
      if (formData.id) {
        console.log(`Removing area assignment for image ${imageId} in property_images table`);
        
        // Update the property_images record to set area to null
        // IMPORTANT: We're only updating the area field, not deleting the image
        const { error } = await supabase
          .from('property_images')
          .update({ area: null })
          .eq('id', imageId)
          .eq('property_id', formData.id);
          
        if (error) {
          console.error('Error updating property_images:', error);
          throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Image removed from area",
      });
      
    } catch (error) {
      console.error('Error removing image from area:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return {
    handleAreaImageRemove
  };
}
