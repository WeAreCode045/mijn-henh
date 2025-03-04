
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from '@/types/property';
import { prepareAreasForFormSubmission } from "../property-form/preparePropertyData";

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
      const areaToUpdate = formData.areas.find(area => area.id === areaId);
      
      if (!areaToUpdate) {
        console.error(`Area with ID ${areaId} not found`);
        throw new Error(`Area with ID ${areaId} not found`);
      }
      
      // Ensure imageIds is an array before filtering
      const currentImageIds = Array.isArray(areaToUpdate.imageIds) ? areaToUpdate.imageIds : [];
      
      // First update the area's imageIds in the local state
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          const updatedImageIds = currentImageIds.filter(id => id !== imageId);
          console.log(`Updating area ${areaId} imageIds after removal:`, updatedImageIds);
          return {
            ...area,
            imageIds: updatedImageIds
          };
        }
        return area;
      });
      
      // Update the form data with the modified areas
      setFormData(prevData => ({
        ...prevData,
        areas: updatedAreas
      }));
      
      // If we have a property ID, also update the database
      if (formData.id) {
        console.log(`Updating area-image relation in database for property ${formData.id}`);
        
        // Convert areas to the format expected by the database
        const areasForDatabase = prepareAreasForFormSubmission(updatedAreas);
        
        // Update the property record with the new areas data
        const { error: updateError } = await supabase
          .from('properties')
          .update({
            areas: areasForDatabase
          })
          .eq('id', formData.id);
        
        if (updateError) {
          console.error('Error updating property areas in database:', updateError);
          throw updateError;
        }
        
        // Also check if we need to update any relationships in the area_images table
        try {
          // This isn't critical functionality, so we don't throw if it fails
          await supabase
            .from('area_images')
            .delete()
            .match({
              area_id: areaId,
              image_id: imageId
            });
        } catch (relationError) {
          console.error('Error updating area_images relationship (non-critical):', relationError);
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
