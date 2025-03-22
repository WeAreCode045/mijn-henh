
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from '@/types/property';

export function useAreaImageSelect(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  const handleAreaImagesSelect = async (areaId: string, imageIds: string[]) => {
    console.log(`Selecting images for area ${areaId}:`, imageIds);
    
    try {
      // Get the selected images objects
      const selectedImages = formData.images.filter(img => imageIds.includes(img.id));
      console.log(`Found ${selectedImages.length} images to assign to area ${areaId}`, selectedImages);
      
      // First update the area's images in the local state
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          console.log(`Updating area ${areaId} with ${selectedImages.length} selected images`);
          return {
            ...area,
            images: selectedImages,
            imageIds: imageIds
          };
        }
        return area;
      });
      
      // Update the form data with the modified areas
      setFormData(prevData => ({
        ...prevData,
        areas: updatedAreas
      }));

      // If we have a property ID, update the property_images table
      if (formData.id) {
        console.log(`Updating area assignments for images in property_images table`);
        
        // First, clear all area assignments for this area
        const { error: clearError } = await supabase
          .from('property_images')
          .update({ area: null })
          .eq('property_id', formData.id)
          .eq('area', areaId);
          
        if (clearError) {
          console.error('Error clearing area assignments:', clearError);
          throw clearError;
        }
        
        // Now set the area for each selected image with default sort order
        for (let i = 0; i < imageIds.length; i++) {
          const { error } = await supabase
            .from('property_images')
            .update({ 
              area: areaId,
              sort_order: i 
            })
            .eq('id', imageIds[i])
            .eq('property_id', formData.id);
            
          if (error) {
            console.error(`Error updating area for image ${imageIds[i]}:`, error);
            throw error;
          }
        }
      }
      
      toast({
        title: "Success",
        description: `Area images updated (${selectedImages.length} images)`,
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
