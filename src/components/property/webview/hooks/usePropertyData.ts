
import { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseData } from "../utils/transformSupabaseData";

export const usePropertyData = (id?: string, property?: PropertyData) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
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
            setError(uuidError.message);
            setIsLoading(false);
            return;
          }

          data = uuidData;
        }

        console.log("usePropertyData - Raw data from Supabase:", data);

        if (data) {
          const transformedData = transformSupabaseData(data);
          console.log("usePropertyData - Transformed property data:", transformedData);
          setPropertyData(transformedData);
        } else {
          console.log("usePropertyData - No property found with ID:", id);
          setError(`Property not found with ID: ${id}`);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else if (property) {
      console.log("usePropertyData - Using provided property data:", property);
      setPropertyData(property);
    }
  }, [id, property]);

  return { propertyData, setPropertyData, isLoading, error };
};
