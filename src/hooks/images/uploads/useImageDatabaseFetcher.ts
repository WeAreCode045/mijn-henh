
import { supabase } from "@/integrations/supabase/client";
import type { PropertyImage } from "@/types/property";

export function useImageDatabaseFetcher() {
  // When fetching images, get them from property_images table and filter out floorplans
  const fetchImages = async (propertyId: string): Promise<PropertyImage[]> => {
    if (!propertyId) return [];
    
    try {
      console.log("Fetching images for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', propertyId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching images:", error);
        throw error;
      }
      
      console.log("Fetched images:", data);
      return data || [];
    } catch (error) {
      console.error('Error fetching property images:', error);
      return [];
    }
  };

  return { fetchImages };
}
