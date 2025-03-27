
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  title: string;
  address?: string;
  status?: string;
  object_id?: string;
}

export function useProperties(searchTerm: string = "", limit: number = 10) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('id, title, address, status, object_id')
          .eq('archived', false)
          .order('title');
          
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }
        
        query = query.limit(limit);
        
        const { data, error } = await query;
        
        if (error) throw error;
        if (data) {
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchTerm, limit]);

  return { properties, isLoading };
}
