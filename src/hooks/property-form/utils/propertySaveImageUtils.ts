
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

/**
 * Saves all images for a newly created property
 * @param propertyId The ID of the property to save images for
 * @param formData The form data containing the images
 */
export async function saveAllImagesForNewProperty(propertyId: string, formData: PropertyFormData) {
  try {
    // Add regular images to property_images table
    for (const image of formData.images) {
      const imageUrl = typeof image === 'string' ? image : image.url;
      await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: imageUrl,
          is_main: formData.featuredImage === imageUrl,
          is_featured_image: formData.featuredImages?.includes(imageUrl) || false,
          type: 'image'
        });
    }
    
    // Add floorplans to property_images table
    if (formData.floorplans && formData.floorplans.length > 0) {
      for (const floorplan of formData.floorplans) {
        const floorplanUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;
        if (!floorplanUrl) continue;
        
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: floorplanUrl,
            type: 'floorplan'
          });
      }
    }
  } catch (error) {
    console.error("Error adding images to property_images table:", error);
    // Don't consider this a failure of the overall save
  }
}
