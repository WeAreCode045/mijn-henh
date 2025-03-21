
import { supabase } from "@/integrations/supabase/client";

export function usePropertyImageHandler() {
  // Helper function to handle property images
  const handlePropertyImages = async (images: string[], propertyId: string) => {
    try {
      // First clear existing images to avoid duplicates
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('type', 'image');

      // Add all images
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: imageUrl,
            is_main: i === 0, // First image is the main image
            type: 'image',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property images:", error);
    }
  };

  // Helper function to handle property floorplans
  const handlePropertyFloorplans = async (floorplans: string[], propertyId: string) => {
    try {
      // First clear existing floorplans to avoid duplicates
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('type', 'floorplan');

      // Add all floorplans
      for (let i = 0; i < floorplans.length; i++) {
        const floorplanUrl = floorplans[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: floorplanUrl,
            type: 'floorplan',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property floorplans:", error);
    }
  };

  return {
    handlePropertyImages,
    handlePropertyFloorplans
  };
}
