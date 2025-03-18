
import { useEffect } from "react";
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
  useEffect(() => {
    console.log("FloorplanDatabaseFetcher - checking if fetch needed", {propertyId, floorplansLength: floorplans?.length});
    
    if (propertyId && (!floorplans || floorplans.length === 0)) {
      const fetchFloorplans = async () => {
        try {
          console.log("FloorplanDatabaseFetcher - fetching floorplans for property:", propertyId);
          
          const { data, error } = await supabase
            .from('property_images')
            .select('id, url, sort_order')
            .eq('property_id', propertyId)
            .eq('type', 'floorplan')
            .order('sort_order', { ascending: true }) // Order by sort_order first
            .order('created_at', { ascending: false }); // Then by created_at as fallback
            
          if (error) {
            console.error("FloorplanDatabaseFetcher - Error fetching floorplans:", error);
            throw error;
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
            
            console.log("FloorplanDatabaseFetcher - Fetched floorplans from DB:", dbFloorplans);
            onFetchComplete(dbFloorplans);
          } else {
            console.log("FloorplanDatabaseFetcher - No floorplans found in DB");
            onFetchComplete([]);
          }
        } catch (error) {
          console.error("Error fetching floorplans from database:", error);
          onFetchComplete([]);
        }
      };
      
      fetchFloorplans();
    }
  }, [propertyId, floorplans, onFetchComplete]);

  return null; // This is a logic-only component with no UI
}
