
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";

interface MediaDatabaseFetcherProps {
  propertyId?: string;
  images?: PropertyImage[];
  onFetchComplete: (images: PropertyImage[]) => void;
}

export function MediaDatabaseFetcher({
  propertyId,
  images,
  onFetchComplete
}: MediaDatabaseFetcherProps) {
  useEffect(() => {
    if (propertyId && (!images || images.length === 0)) {
      const fetchImages = async () => {
        try {
          const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId)
            .eq('type', 'image')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Transform to PropertyImage objects
            const dbImages: PropertyImage[] = data.map(item => ({
              id: item.id,
              url: item.url
            }));
            
            console.log("MediaDatabaseFetcher - Fetched images from DB:", dbImages);
            onFetchComplete(dbImages);
          } else {
            console.log("MediaDatabaseFetcher - No images found in DB");
            onFetchComplete([]);
          }
        } catch (error) {
          console.error("Error fetching images from database:", error);
          onFetchComplete([]);
        }
      };
      
      fetchImages();
    }
  }, [propertyId, images, onFetchComplete]);

  return null; // This is a logic-only component with no UI
}
