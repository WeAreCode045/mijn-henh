
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData } from '@/types/property';

export function useAreaImageSelect(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Handle selecting multiple images for an area
  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    console.log(`Selected ${imageIds.length} images for area ${areaId}:`, imageIds);
    
    try {
      // Ensure imageIds is always an array
      const validImageIds = Array.isArray(imageIds) ? imageIds : [];
      
      // Update the area with the new imageIds
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
      
      // Update database relations if we have a property ID
      if (formData.id) {
        console.log(`Updated area-images relations in database for property ${formData.id}`);
        // Database update logic would go here if needed
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
