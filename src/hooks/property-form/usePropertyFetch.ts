
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyData, PropertyFeature } from '@/types/property';

export function usePropertyFetch(propertyId?: string) {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get property data
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // If the property has an agent assigned, get the agent info
          let agentInfo = null;
          
          if (data.agent_id) {
            const { data: agentData, error: agentError } = await supabase
              .from('employer_profiles')
              .select('id, first_name, last_name')
              .eq('id', data.agent_id)
              .single();
              
            if (!agentError && agentData) {
              agentInfo = {
                id: agentData.id,
                name: `${agentData.first_name || ''} ${agentData.last_name || ''}`.trim() || 'Unnamed Agent'
              };
            }
          }
          
          // Get property images
          const { data: imageData, error: imageError } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId);
            
          if (imageError) {
            console.error('Error fetching property images:', imageError);
          }
          
          // Parse features as PropertyFeature[]
          let parsedFeatures: PropertyFeature[] = [];
          if (data.features) {
            try {
              // If features is a JSON string, parse it
              if (typeof data.features === 'string') {
                parsedFeatures = JSON.parse(data.features);
              } 
              // If features is already an array, use it directly
              else if (Array.isArray(data.features)) {
                parsedFeatures = data.features;
              }
              // If features is a JSONB object from PostgreSQL, it might already be parsed
              else if (typeof data.features === 'object') {
                parsedFeatures = Array.isArray(data.features) ? data.features : [];
              }
            } catch (e) {
              console.error('Error parsing features:', e);
              parsedFeatures = [];
            }
          }
          
          const propertyData: PropertyData = {
            id: data.id,
            ...data,
            agent: agentInfo,
            // Ensure images is defined to satisfy the PropertyData interface
            images: imageData || [],
            // Use parsed features
            features: parsedFeatures
          };
          
          setProperty(propertyData);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        console.error('Error fetching property:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);
  
  return { property, isLoading, error };
}
