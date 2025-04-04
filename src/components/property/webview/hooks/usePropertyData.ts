
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
        
        // First try to fetch by object_id (most likely for webview URLs)
        let { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*),
            agent:profiles(id, full_name, email, phone, avatar_url)
          `)
          .eq('object_id', id)
          .maybeSingle();

        // If not found by object_id, try by UUID
        if (!data && !error) {
          console.log("usePropertyData - Not found by object_id, trying UUID:", id);
          const { data: uuidData, error: uuidError } = await supabase
            .from('properties')
            .select(`
              *,
              property_images(*),
              agent:profiles(id, full_name, email, phone, avatar_url)
            `)
            .eq('id', id)
            .maybeSingle();

          if (uuidError) {
            console.error('Error fetching property by UUID:', uuidError);
            if (isMounted.current) {
              setError(uuidError.message);
              setIsLoading(false);
            }
            return;
          }

          data = uuidData;
        }

        if (data) {
          console.log("usePropertyData - Raw data from Supabase:", {
            id: data?.id,
            objectId: data?.object_id,
            hasFloorplanScript: !!data?.floorplanEmbedScript,
            scriptLength: data?.floorplanEmbedScript ? data.floorplanEmbedScript.length : 0,
            scriptType: typeof data.floorplanEmbedScript,
            imageCount: data?.property_images?.length || 0
          });

          const propertyWithAgent = {
            ...data,
            agent: data.agent || null,
            features: Array.isArray(data.features) ? data.features : 
                     (data.features ? [data.features] : []),
            nearby_places: Array.isArray(data.nearby_places) ? data.nearby_places : 
                          (data.nearby_places ? [data.nearby_places] : []),
            areas: Array.isArray(data.areas) ? data.areas : 
                  (data.areas ? [data.areas] : []),
          };
          
          const transformedData = transformSupabaseData(propertyWithAgent as any);
          console.log("usePropertyData - Transformed property data:", {
            id: transformedData.id,
            hasFloorplanScript: !!transformedData.floorplanEmbedScript,
            scriptLength: transformedData.floorplanEmbedScript ? transformedData.floorplanEmbedScript.length : 0,
            imageCount: transformedData.images?.length || 0
          });
          
          if (isMounted.current) {
            setPropertyData(transformedData);
            setIsLoading(false);
          }
        } else {
          console.error("usePropertyData - No property found with ID:", id);
          if (isMounted.current) {
            setError(`Property not found with ID: ${id}`);
            setIsLoading(false);
          }
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
