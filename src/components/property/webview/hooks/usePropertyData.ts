
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
    // Set up the mounted ref
    isMounted.current = true;
    
    return () => {
      // Clean up - component unmounted
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // If we already have the property data passed as a prop, use that
    if (property) {
      console.log("usePropertyData - Using provided property data:", property);
      setPropertyData(property);
      setIsLoading(false);
      return;
    }

    // If no id is provided, we can't fetch property data
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
        
        // First try to fetch by object_id
        let { data, error } = await supabase
          .from('properties')
          .select('*, property_images(*)')
          .eq('object_id', id)
          .maybeSingle();

        // If not found by object_id, try by UUID
        if (!data && !error) {
          console.log("usePropertyData - Not found by object_id, trying UUID:", id);
          const { data: uuidData, error: uuidError } = await supabase
            .from('properties')
            .select('*, property_images(*)')
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
          const transformedData = transformSupabaseData(data);
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
