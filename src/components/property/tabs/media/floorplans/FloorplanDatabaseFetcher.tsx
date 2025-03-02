
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanDatabaseFetcherProps {
  propertyId?: string;
  floorplans: PropertyFloorplan[] | string[];
  onFetchComplete: (floorplans: PropertyFloorplan[]) => void;
}

export function FloorplanDatabaseFetcher({
  propertyId,
  floorplans,
  onFetchComplete
}: FloorplanDatabaseFetcherProps) {
  useEffect(() => {
    if (propertyId && (!floorplans || floorplans.length === 0)) {
      const fetchFloorplans = async () => {
        try {
          const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId)
            .eq('type', 'floorplan')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Transform to simple PropertyFloorplan objects to avoid deep nesting
            const dbFloorplans: PropertyFloorplan[] = data.map(item => {
              return {
                id: item.id,
                url: item.url,
                columns: 1
              };
            });
            
            console.log("FloorplanDatabaseFetcher - Fetched floorplans from DB:", dbFloorplans);
            onFetchComplete(dbFloorplans);
          }
        } catch (error) {
          console.error("Error fetching floorplans from database:", error);
        }
      };
      
      fetchFloorplans();
    }
  }, [propertyId, floorplans, onFetchComplete]);

  return null; // This is a logic-only component with no UI
}
