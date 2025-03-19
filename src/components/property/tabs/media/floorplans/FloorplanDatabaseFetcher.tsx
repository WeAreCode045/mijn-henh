
import { useEffect, useState, useRef } from "react";
import { PropertyFloorplan, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toPropertyFloorplanArray } from "@/utils/imageTypeConverters";

interface FloorplanDatabaseFetcherProps {
  propertyId: string;
  floorplans?: PropertyFloorplan[];
  onFetchComplete: (floorplans: PropertyImage[]) => void;
}

export function FloorplanDatabaseFetcher({ 
  propertyId,
  floorplans = [],
  onFetchComplete
}: FloorplanDatabaseFetcherProps) {
  const [isFetching, setIsFetching] = useState(false);
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    // Skip if we don't have a property ID or if already fetched
    if (!propertyId || fetchedRef.current) return;
    
    const fetchFloorplans = async () => {
      setIsFetching(true);
      try {
        console.log("FloorplanDatabaseFetcher - Fetching floorplans for property:", propertyId);
        
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', 'floorplan')
          .order('sort_order', { ascending: true });
          
        if (error) {
          console.error("Error fetching floorplans:", error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log("FloorplanDatabaseFetcher - Fetched floorplans:", data.length);
          // Format as PropertyImage type which will be converted to PropertyFloorplan in the parent
          const formattedFloorplans: PropertyImage[] = data.map(item => ({
            id: item.id,
            url: item.url,
            area: item.area,
            property_id: item.property_id,
            is_main: item.is_main,
            is_featured_image: item.is_featured_image,
            sort_order: item.sort_order,
            type: "floorplan" as const
          }));
          
          onFetchComplete(formattedFloorplans);
          fetchedRef.current = true;
        } else {
          console.log("FloorplanDatabaseFetcher - No floorplans found for property:", propertyId);
        }
      } catch (error) {
        console.error("Error in floorplan fetch:", error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchFloorplans();
  }, [propertyId, onFetchComplete]);
  
  return null; // This is a data-fetching component with no UI
}
