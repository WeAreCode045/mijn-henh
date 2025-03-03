
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from '@/types/property';

export function useAreaImageRemove(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Remove an image from an area
  const handleAreaImageRemove = async (areaId: string, imageId: string) => {
    console.log(`Removing image ${imageId} from area ${areaId}`);
    
    try {
      // Find the image to get its URL
      const imageToRemove = formData.images.find(img => img.id === imageId);
      
      if (!imageToRemove) {
        console.error(`Image with ID ${imageId} not found`);
        throw new Error(`Image with ID ${imageId} not found`);
      }
      
      // First update the area's imageIds in the local state
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          const updatedImageIds = (area.imageIds || []).filter(id => id !== imageId);
          console.log(`Updating area ${areaId} imageIds after removal:`, updatedImageIds);
          return {
            ...area,
            imageIds: updatedImageIds
          };
        }
        return area;
      });
      
      // Update the form data with the modified areas
      setFormData({
        ...formData,
        areas: updatedAreas
      });
      
      // If we have a property ID, also remove from the database
      if (formData.id && imageToRemove) {
        // Try to remove from property_images table
        // Note: We don't remove from storage to avoid breaking other references
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageId)
          .eq('property_id', formData.id);
          
        if (error) {
          console.error('Error removing image from database:', error);
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
