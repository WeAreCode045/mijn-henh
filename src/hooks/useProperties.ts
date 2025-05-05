
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
        
        // Process properties
        const propertyPromises = data.map(async (property) => {
          // Default property data
          const propertyData: Property = {
            ...property,
            agent: property.agent_id ? {
              id: property.agent_id,
              name: "Agent"  // Default name until we fetch actual agent info
            } : null
          };
          
          // Try to get agent info if agent_id exists
          if (property.agent_id) {
            try {
              const { data: agentData, error: agentError } = await supabase
                .from('employer_profiles')
                .select('id, first_name, last_name')
                .eq('id', property.agent_id)
                .maybeSingle();
                
              if (!agentError && agentData) {
                propertyData.agent = {
                  id: agentData.id,
                  name: `${agentData.first_name || ''} ${agentData.last_name || ''}`.trim() || 'Unnamed Agent'
                };
              }
            } catch (err) {
              console.error('Error fetching agent info:', err);
            }
          }
          
          return propertyData;
        });
        
        // Wait for all property promises to resolve
        const processedProperties = await Promise.all(propertyPromises);
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
