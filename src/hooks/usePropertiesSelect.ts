
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyOption {
  id: string;
  title: string;
}

export function usePropertiesSelect() {
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title')
          .order('title');

        if (!error && data) {
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, isLoading };
}
