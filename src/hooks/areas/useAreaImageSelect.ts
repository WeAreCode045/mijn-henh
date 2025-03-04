
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from '@/types/property';

export function useAreaImageSelect(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Handle selecting multiple images for an area
  const handleAreaImagesSelect = async (areaId: string, imageIds: string[]) => {
    console.log(`Selected ${imageIds.length} images for area ${areaId}:`, imageIds);
    
    try {
      // Ensure imageIds is always an array
      const validImageIds = Array.isArray(imageIds) ? imageIds : [];
      
      // If we have a property ID, update the property_images table
      if (formData.id) {
        console.log(`Updating image-area associations in property_images table for property ${formData.id}, area ${areaId}`);
        
        // First, clear any existing area assignments for this area
        // This ensures we don't have outdated assignments
        const { error: clearError } = await supabase
          .from('property_images')
          .update({ 
            area: null
          } as any)
          .eq('property_id', formData.id)
          .eq('area', areaId);
          
        if (clearError) {
          console.error('Error clearing existing area assignments:', clearError);
        }
        
        // Then, assign the selected images to this area
        for (const imageId of validImageIds) {
          const { error: updateError } = await supabase
            .from('property_images')
            .update({ 
              area: areaId
            } as any)
            .eq('id', imageId)
            .eq('property_id', formData.id);
            
          if (updateError) {
            console.error(`Error assigning image ${imageId} to area ${areaId}:`, updateError);
          }
        }
      }
      
      // Update the local form state to reflect these changes
      // For backward compatibility, we'll still update the areas with imageIds
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          console.log(`Updating local state for area ${areaId} imageIds:`, validImageIds);
          return {
            ...area,
            imageIds: validImageIds
          };
        }
        return area;
      });
      
      // Update the form data with the modified areas
      setFormData(prevData => ({
        ...prevData,
        areas: updatedAreas
      }));
      
      toast({
        title: "Success",
        description: "Images updated for area",
      });
    } catch (error) {
      console.error('Error selecting images for area:', error);
      toast({
        title: "Error",
        description: "Failed to update area images",
        variant: "destructive",
      });
    }
  };

  return {
    handleAreaImagesSelect
  };
}
