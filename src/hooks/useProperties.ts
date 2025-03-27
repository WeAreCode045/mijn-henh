
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
}

export function useProperties(searchTerm: string = "", limit: number = 10) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
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

  return { properties, isLoading, handleDelete, refetch };
}
