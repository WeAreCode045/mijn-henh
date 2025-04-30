
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyData, PropertyFeature, PropertyArea, PropertyNearbyPlace, PropertyCity } from '@/types/property';
import { transformFeatures, transformAreas, transformNearbyPlaces, transformNearbyCities } from './propertyDataTransformer';

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
          
          // Process features data
          const processedFeatures: PropertyFeature[] = transformFeatures(data.features || []);
          
          // Process areas data
          const processedAreas: PropertyArea[] = transformAreas(data.areas || []);
          
          // Process nearby places
          const processedNearbyPlaces: PropertyNearbyPlace[] = transformNearbyPlaces(data.nearby_places || []);
          
          // Process nearby cities
          const processedNearbyCities: PropertyCity[] = transformNearbyCities(data.nearby_cities || []);
          
          const propertyData: PropertyData = {
            id: data.id,
            ...data,
            agent: agentInfo,
            // Ensure images is defined to satisfy the PropertyData interface
            images: imageData || [],
            // Use transformed data
            features: processedFeatures,
            areas: processedAreas,
            nearby_places: processedNearbyPlaces,
            nearby_cities: processedNearbyCities
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
