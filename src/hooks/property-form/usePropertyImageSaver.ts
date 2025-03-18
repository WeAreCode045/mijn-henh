
import { PropertyFormData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toPropertyImage } from "@/utils/imageTypeConverters";

export function usePropertyImageSaver() {
  const savePropertyImages = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id) return false;
    
    try {
      // First reset all image flags
      await supabase
        .from('property_images')
        .update({ is_main: false, is_featured_image: false })
        .eq('property_id', formData.id);
      
      // Set main image
      if (formData.featuredImage) {
        console.log("Setting main image in database:", formData.featuredImage);
        const { error } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', formData.id)
          .eq('url', formData.featuredImage);
          
        if (error) {
          console.error("Error setting main image:", error);
        }
      }
      
      // Set featured images
      if (formData.featuredImages && formData.featuredImages.length > 0) {
        for (const image of formData.featuredImages) {
          const imageUrl = typeof image === 'string' ? image : image.url;
          console.log("Setting featured image in database:", imageUrl);
          const { error } = await supabase
            .from('property_images')
            .update({ is_featured_image: true })
            .eq('property_id', formData.id)
            .eq('url', imageUrl);
            
          if (error) {
            console.error("Error setting featured image:", error);
          }
        }
      }
      
      // Update floorplans
      await savePropertyFloorplans(formData);
      
      return true;
    } catch (error) {
      console.error("Error updating image flags:", error);
      return false;
    }
  };

  const savePropertyFloorplans = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id || !formData.floorplans || formData.floorplans.length === 0) {
      return false;
    }
    
    try {
      // First, get existing floorplans
      const { data: existingFloorplans } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', formData.id)
        .eq('type', 'floorplan');
        
      const existingUrls = existingFloorplans?.map(f => f.url) || [];
      
      // Add new floorplans
      for (const floorplan of formData.floorplans) {
        const floorplanUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;
        if (!floorplanUrl || existingUrls.includes(floorplanUrl)) continue;
        
        await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: floorplanUrl,
            type: 'floorplan'
          });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating floorplans:", error);
      return false;
    }
  };

  return {
    savePropertyImages,
    savePropertyFloorplans
  };
}
