
import { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseData } from "../utils/transformSupabaseData";

export const usePropertyData = (id?: string, property?: PropertyData) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        // First try to fetch by object_id
        let { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('object_id', id)
          .maybeSingle();

        // If not found by object_id, try by UUID
        if (!data && !error) {
          const { data: uuidData, error: uuidError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (uuidError) {
            console.error('Error fetching property:', uuidError);
            return;
          }

          data = uuidData;
        }

        if (data) {
          setPropertyData(transformSupabaseData(data));
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    if (id) {
      fetchProperty();
    } else if (property) {
      setPropertyData(property);
    }
  }, [id, property]);

  return { propertyData, setPropertyData };
};
