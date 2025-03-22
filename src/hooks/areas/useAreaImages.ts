
import { useState, useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function useAreaImages(areaId: string, propertyId?: string, areaImages?: PropertyImage[] | string[]) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!areaId) {
        setImages([]);
        return;
      }
      
      if (propertyId) {
        try {
          const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId)
            .eq('area', areaId)
            .order('sort_order', { ascending: true });
            
          if (error) {
            console.error(`Error fetching images for area ${areaId} from property_images:`, error);
          } else if (data && data.length > 0) {
            console.log(`Area ${areaId} - Found ${data.length} images from property_images table:`, data);
            setImages(data as PropertyImage[]);
            return;
          }
        } catch (err) {
          console.error(`Error in fetching area images from property_images:`, err);
        }
      }
      
      if (areaImages && Array.isArray(areaImages) && areaImages.length > 0) {
        console.log(`Area ${areaId} - Using ${areaImages.length} images from area.images:`, areaImages);
        setImages(areaImages as PropertyImage[]);
      } else {
        setImages([]);
      }
    };
    
    fetchAreaImages();
  }, [areaId, propertyId, areaImages]);

  return { images, setImages };
}
