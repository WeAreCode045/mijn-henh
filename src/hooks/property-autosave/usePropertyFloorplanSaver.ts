
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFloorplanSaver() {
  /**
   * Handles saving floorplan data for a property
   */
  const handleFloorplans = async (formData: PropertyFormData) => {
    if (!formData.id || !formData.floorplans || formData.floorplans.length === 0) {
      return;
    }
    
    try {
      const { data: existingFloorplans } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', formData.id)
        .eq('type', 'floorplan');
        
      const existingUrls = existingFloorplans?.map(f => f.url) || [];
      
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
    } catch (error) {
      console.error('Error updating floorplans:', error);
    }
  };

  return {
    handleFloorplans
  };
}
