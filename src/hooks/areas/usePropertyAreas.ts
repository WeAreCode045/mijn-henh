
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyArea } from '@/types/property/PropertyAreaTypes';

// This is a temporary implementation to fix the white screen issue
// We'll properly implement this later
export function usePropertyAreas(propertyId: string | undefined) {
  const [areas, setAreas] = useState<PropertyArea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAreas = useCallback(async () => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_areas')
        .select('*')
        .eq('property_id', propertyId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching areas:', error);
        return [];
      }

      if (data) {
        setAreas(data as PropertyArea[]);
      }
    } catch (err) {
      console.error('Unexpected error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return { areas, loading, fetchAreas };
}
