
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [hasFetched, setHasFetched] = useState(false);
  const fetchingRef = useRef(false);
  
  useEffect(() => {
    // Reset fetch state when property ID changes
    if (propertyId) {
      setHasFetched(false);
      fetchingRef.current = false;
    }
  }, [propertyId]);
  
  const fetchImages = useCallback(async () => {
    if (!propertyId || hasFetched || fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      console.log("MediaDatabaseFetcher - fetching images for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_images')
        .select('id, url, is_main, is_featured_image, sort_order')
        .eq('property_id', propertyId)
        .eq('type', 'image')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("MediaDatabaseFetcher - Error fetching images:", error);
        return;
      }
      
      if (data && data.length > 0) {
        // Transform to PropertyImage objects
        const dbImages: PropertyImage[] = data.map(item => ({
          id: item.id,
          url: item.url,
          is_main: item.is_main,
          is_featured_image: item.is_featured_image,
          sort_order: item.sort_order,
          type: "image" // Add the required type field
        }));
        
        console.log("MediaDatabaseFetcher - Fetched images from DB:", dbImages.length);
        onFetchComplete(dbImages);
      } else {
        console.log("MediaDatabaseFetcher - No images found in DB");
        onFetchComplete([]);
      }
      
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching images from database:", error);
    } finally {
      fetchingRef.current = false;
    }
  }, [propertyId, hasFetched, onFetchComplete]);

  useEffect(() => {
    if (propertyId && !hasFetched && !fetchingRef.current) {
      fetchImages();
    }
  }, [propertyId, fetchImages, hasFetched]);

  return null; // This is a logic-only component with no UI
}
