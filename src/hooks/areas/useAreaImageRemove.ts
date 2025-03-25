import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyArea, PropertyImage, AreaImage } from '@/types/property';

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
      
      // Update the area's images in the local state using the new format
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          // Remove the image from areaImages array
          const updatedAreaImages = Array.isArray(area.areaImages)
            ? area.areaImages.filter((img: AreaImage) => img.id !== imageId)
            : [];
            
          // For backward compatibility, also update the legacy fields
          const updatedImages = area.images 
            ? area.images.filter(img => {
                if (typeof img === 'string') return img !== imageId;
                if (typeof img === 'object' && 'id' in img) return img.id !== imageId;
                return true;
              }) 
            : [];
          
          const updatedImageIds = area.imageIds
            ? area.imageIds.filter(id => id !== imageId)
            : [];
            
          console.log(`Updating area ${areaId} images after removal:`, updatedAreaImages);
          
          return {
            ...area,
            areaImages: updatedAreaImages,
            images: updatedImages,
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
      
      // If we have a property ID, update the property_images table
      if (formData.id) {
        console.log(`Removing area assignment for image ${imageId} in property_images table`);
        
        // Update the property_images record to set area to null
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
