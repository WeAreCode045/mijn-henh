
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyData } from "@/types/property";

export interface Property {
  id: string;
  title: string;
  address?: string;
  status?: string;
  object_id?: string;
  price?: string;
  agent_id?: string;
  agent?: {
    id: string;
    name: string;
  } | null;
}

export function useProperties(searchTerm: string = "", limit: number = 50) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("useProperties - Fetching properties");
      
      // Check if the user is authenticated first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log("No authenticated session found");
        setProperties([]);
        setIsLoading(false);
        return;
      }
      
      let query = supabase
        .from('properties')
        .select('id, title, address, status, object_id, price, agent_id')
        .eq('archived', false)
        .order('title');
        
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        setError(error);
        setProperties([]);
      } else if (data) {
        console.log(`useProperties - Fetched ${data.length} properties`);
        const processedProperties = data.map(item => {
          return {
            ...item,
            agent: item.agent_id ? {
              id: item.agent_id,
              name: "Agent"  // Default name until we fetch actual agent info
            } : null
          };
        });
        setProperties(processedProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm, limit]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ archived: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the properties list
      fetchProperties();
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting property:', error);
      return Promise.reject(error);
    }
  };

  const refetch = () => {
    fetchProperties();
  };

  return { properties, isLoading, error, handleDelete, refetch };
}
