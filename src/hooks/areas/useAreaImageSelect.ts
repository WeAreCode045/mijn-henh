
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from '@/types/property';
import { prepareAreasForFormSubmission } from "../property-form/preparePropertyData";

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
      
      // Update the area with the new imageIds in the form state
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          console.log(`Updating area ${areaId} imageIds:`, validImageIds);
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
      
      // If we have a property ID, also update the database
      if (formData.id) {
        console.log(`Updating area-images relations in database for property ${formData.id}, area ${areaId}`);
        
        // First, get the updated area data
        const updatedArea = updatedAreas.find(area => area.id === areaId);
        if (!updatedArea) {
          throw new Error(`Area with ID ${areaId} not found after update`);
        }
        
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
      }
      
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
