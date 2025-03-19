
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanDatabaseFetcherProps {
  propertyId: string;
  onFloorplansUpdate: (floorplans: PropertyFloorplan[]) => void;
}

export function FloorplanDatabaseFetcher({
  propertyId,
  onFloorplansUpdate
}: FloorplanDatabaseFetcherProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchFloorplans = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', 'floorplan')
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedFloorplans = data.map((fp): PropertyFloorplan => ({
            id: fp.id,
            url: fp.url,
            title: fp.title || '', // Handle missing title property
            description: fp.description || '', // Handle missing description property
            sort_order: fp.sort_order || 0,
            property_id: fp.property_id,
            type: 'floorplan',
            alt: fp.title || '', // Handle missing title property
          }));
          onFloorplansUpdate(formattedFloorplans);
        }
      } catch (err) {
        console.error('Error fetching floorplans:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFloorplans();
  }, [propertyId, onFloorplansUpdate]);

  // Component doesn't render anything
  return null;
}
