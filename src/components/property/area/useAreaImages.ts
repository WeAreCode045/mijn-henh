
import { useState, useEffect } from "react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { normalizeImage } from "@/utils/imageHelpers";
import { AreaImageData } from "@/types/area/AreaImageData";

export function useAreaImages(area: PropertyArea, propertyId?: string) {
  const [areaImages, setAreaImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!area) {
        setAreaImages([]);
        setLoading(false);
        return;
      }
      
      if (propertyId) {
        try {
          const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId)
            .eq('area', area.id);
            
          if (error) {
            console.error(`Error fetching images for area ${area.id} from property_images:`, error);
            setError(error.message);
          } else if (data && data.length > 0) {
            console.log(`AreaCard ${area.id} - Found ${data.length} images from property_images table:`, data);
            // Convert the raw data to PropertyImage[] with correctly typed 'type' property
            const convertedImages: PropertyImage[] = data.map((img: any) => ({
              id: img.id,
              url: img.url,
              area: img.area,
              type: (img.type === "floorplan" ? "floorplan" : "image"),
              is_main: img.is_main,
              is_featured_image: img.is_featured_image,
              sort_order: img.sort_order,
              property_id: img.property_id
            }));
            setAreaImages(convertedImages);
          } else {
            console.log(`AreaCard ${area.id} - No images found in property_images table`);
            setAreaImages([]);
          }
        } catch (err) {
          console.error(`Error in fetching area images from property_images:`, err);
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
          setLoading(false);
        }
      } else {
        if (area.images && area.images.length > 0) {
          const normalizedImages = area.images.map(img => {
            const normalized = normalizeImage(img);
            // Ensure type is always "image" or "floorplan"
            return {
              ...normalized,
              type: (normalized.type === "floorplan" ? "floorplan" : "image")
            };
          });
          setAreaImages(normalizedImages);
        } else {
          setAreaImages([]);
        }
        setLoading(false);
      }
    };
    
    fetchAreaImages();
  }, [area, propertyId]);
  
  return { areaImages, loading, error };
}
