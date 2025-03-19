
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanDatabaseFetcherProps {
  propertyId?: string;
  floorplans?: PropertyFloorplan[];
  onFetchComplete: (floorplans: PropertyFloorplan[]) => void;
}

export function FloorplanDatabaseFetcher({
  propertyId,
  floorplans,
  onFetchComplete
}: FloorplanDatabaseFetcherProps) {
  const [hasFetched, setHasFetched] = useState(false);
  const fetchingRef = useRef(false);
  
  useEffect(() => {
    // Reset fetch state when property ID changes
    if (propertyId) {
      setHasFetched(false);
      fetchingRef.current = false;
    }
  }, [propertyId]);
  
  const fetchFloorplans = useCallback(async () => {
    if (!propertyId || hasFetched || fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      console.log("FloorplanDatabaseFetcher - fetching floorplans for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_images')
        .select('id, url, sort_order')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("FloorplanDatabaseFetcher - Error fetching floorplans:", error);
        return;
      }
      
      if (data && data.length > 0) {
        // Transform to PropertyFloorplan objects
        const dbFloorplans: PropertyFloorplan[] = data.map(item => ({
          id: item.id,
          url: item.url,
          columns: 12,
          title: 'Floorplan',
          sort_order: item.sort_order || undefined,
          type: "floorplan" // Add the required type field
        }));
        
        console.log("FloorplanDatabaseFetcher - Fetched floorplans from DB:", dbFloorplans.length);
        onFetchComplete(dbFloorplans);
      } else {
        console.log("FloorplanDatabaseFetcher - No floorplans found in DB");
        onFetchComplete([]);
      }
      
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching floorplans from database:", error);
    } finally {
      fetchingRef.current = false;
    }
  }, [propertyId, hasFetched, onFetchComplete]);
  
  useEffect(() => {
    if (propertyId && !hasFetched && !fetchingRef.current) {
      fetchFloorplans();
    }
  }, [propertyId, fetchFloorplans, hasFetched]);

  return null; // This is a logic-only component with no UI
}
