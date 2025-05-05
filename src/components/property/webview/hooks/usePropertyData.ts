
import { useState, useEffect, useRef } from "react";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseData } from "../utils/transformSupabaseData";

export const usePropertyData = (id?: string, property?: PropertyData) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(property || null);
  const [isLoading, setIsLoading] = useState<boolean>(!property && !!id);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (property) {
      console.log("usePropertyData - Using provided property data:", {
        id: property.id,
        hasFloorplanScript: !!property.floorplanEmbedScript,
        scriptLength: property.floorplanEmbedScript ? property.floorplanEmbedScript.length : 0
      });
      setPropertyData(property);
      setIsLoading(false);
      return;
    }

    if (!id) {
      console.log("usePropertyData - No ID provided and no property data");
      setError("No property ID provided");
      setIsLoading(false);
      return;
    }

    // Validate if id is a proper UUID or object_id string
    const isValidId = id.trim() !== '';
    
    if (!isValidId) {
      console.log("usePropertyData - Invalid ID provided:", id);
      setError("Invalid property ID provided");
      setIsLoading(false);
      return;
    }
    
    const fetchProperty = async () => {
      if (!id || !isMounted.current) return;
      
      setIsLoading(true);
      setError(null);

      try {
        console.log("usePropertyData - Fetching property with ID:", id);
        
        // First try to fetch by id (most likely for normal URLs)
        let { data, error } = await supabase
          .from('properties')
          .select(`*`)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching property:', error);
          throw error;
        }

        // If not found by id, try by object_id
        if (!data) {
          console.log("usePropertyData - Not found by UUID, trying object_id:", id);
          const { data: objectIdData, error: objectIdError } = await supabase
            .from('properties')
            .select(`*`)
            .eq('object_id', id)
            .maybeSingle();

          if (objectIdError) {
            console.error('Error fetching property by object_id:', objectIdError);
            throw objectIdError;
          }

          data = objectIdData;
        }

        if (!data) {
          throw new Error(`Property not found with ID: ${id}`);
        }

        // Fetch property images
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', data.id);
          
        if (imageError) {
          console.error('Error fetching property images:', imageError);
          // Continue without images rather than failing completely
        }

        // Fetch agent data if agent_id exists
        let agentData = null;
        if (data.agent_id) {
          const { data: agent, error: agentError } = await supabase
            .from('employer_profiles')
            .select('id, first_name, last_name, email, phone, avatar_url')
            .eq('id', data.agent_id)
            .maybeSingle();
            
          if (agentError) {
            console.error('Error fetching agent:', agentError);
          } else if (agent) {
            agentData = {
              id: agent.id,
              name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unnamed Agent',
              email: agent.email,
              phone: agent.phone,
              photoUrl: agent.avatar_url
            };
          }
        }

        // Prepare the property data with images and agent
        const propertyWithDetails = {
          ...data,
          property_images: imageData || [],
          agent: agentData,
          // Ensure these are properly formatted arrays
          features: Array.isArray(data.features) ? data.features : 
                   (data.features ? [data.features] : []),
          nearby_places: Array.isArray(data.nearby_places) ? data.nearby_places : 
                        (data.nearby_places ? [data.nearby_places] : []),
          areas: Array.isArray(data.areas) ? data.areas : 
                (data.areas ? [data.areas] : []),
        };
        
        // Transform the data to proper PropertyData format
        const transformedData = transformSupabaseData(propertyWithDetails as any);
        
        console.log("usePropertyData - Transformed property data:", {
          id: transformedData.id,
          hasImages: transformedData.images?.length > 0,
          imageCount: transformedData.images?.length || 0,
          hasAgent: !!transformedData.agent
        });
        
        if (isMounted.current) {
          setPropertyData(transformedData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        if (isMounted.current) {
          setError(error instanceof Error ? error.message : 'Unknown error occurred');
          setIsLoading(false);
        }
      }
    };

    fetchProperty();
  }, [id, property]);

  return { propertyData, setPropertyData, isLoading, error };
};
