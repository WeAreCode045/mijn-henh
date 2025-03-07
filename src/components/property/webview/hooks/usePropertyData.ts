
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
      console.log("usePropertyData - Using provided property data:", property);
      setPropertyData(property);
      setIsLoading(false);
      return;
    }

    if (!id) {
      console.log("usePropertyData - No ID provided and no property data");
      setIsLoading(false);
      return;
    }
    
    const fetchProperty = async () => {
      if (!id || !isMounted.current) return;
      
      setIsLoading(true);
      setError(null);

      try {
        console.log("usePropertyData - Fetching property with ID:", id);
        
        let { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*),
            agent:profiles(id, full_name, email, phone, photo_url:agent_photo)
          `)
          .eq('object_id', id)
          .maybeSingle();

        if (!data && !error) {
          console.log("usePropertyData - Not found by object_id, trying UUID:", id);
          const { data: uuidData, error: uuidError } = await supabase
            .from('properties')
            .select(`
              *,
              property_images(*),
              agent:profiles(id, full_name, email, phone, photo_url:agent_photo)
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

        console.log("usePropertyData - Raw data from Supabase:", data);

        if (data) {
          // Make sure agent is properly structured
          const propertyWithAgent = {
            ...data,
            agent: data.agent || null,
            // Ensure these are always arrays, even if they're not in the database
            features: Array.isArray(data.features) ? data.features : 
                     (data.features ? [data.features] : []),
            nearby_places: Array.isArray(data.nearby_places) ? data.nearby_places : 
                          (data.nearby_places ? [data.nearby_places] : []),
            areas: Array.isArray(data.areas) ? data.areas : 
                  (data.areas ? [data.areas] : []),
            floorplanEmbedScript: data.floorplanEmbedScript || ""
          };
          
          const transformedData = transformSupabaseData(propertyWithAgent as any);
          console.log("usePropertyData - Transformed property data:", transformedData);
          
          if (isMounted.current) {
            setPropertyData(transformedData);
            setIsLoading(false);
          }
        } else {
          console.log("usePropertyData - No property found with ID:", id);
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
