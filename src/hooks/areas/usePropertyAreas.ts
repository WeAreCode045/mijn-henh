
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyArea } from '@/types/property';

export interface UsePropertyAreasReturn {
  areas: PropertyArea[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePropertyAreas(propertyId: string): UsePropertyAreasReturn {
  const {
    data: areas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['property-areas', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('areas')
        .eq('id', propertyId)
        .single();
        
      if (error) throw error;
      
      return data?.areas || [];
    },
    enabled: !!propertyId,
  });

  return {
    areas,
    isLoading,
    error: error as Error,
    refetch: async () => {
      await refetch();
    },
  };
}
