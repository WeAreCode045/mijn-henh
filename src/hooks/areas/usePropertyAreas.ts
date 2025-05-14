
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyArea } from '@/types/property';

interface PropertyAreasOptions {
  enabled?: boolean;
}

export function usePropertyAreas(propertyId?: string, options?: PropertyAreasOptions) {
  return useQuery({
    queryKey: ['property-areas', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];

      try {
        // First get the property areas
        const { data: areas, error } = await supabase
          .from('properties')
          .select('areas')
          .eq('id', propertyId)
          .single();

        if (error) {
          console.error("Error fetching property areas:", error);
          throw error;
        }

        // Return the areas array or an empty array if it's null
        return (areas?.areas || []) as PropertyArea[];
      } catch (error) {
        console.error("Error in usePropertyAreas:", error);
        throw error;
      }
    },
    enabled: !!propertyId && (options?.enabled !== false),
  });
}
