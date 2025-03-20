
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';

export function useNearbyCities(
  formData: PropertyFormData,
  toast: any
) {
  const fetchNearbyCities = useCallback(async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          citiesOnly: true,
          propertyId: formData.id
        }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log("Nearby cities fetched:", data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities",
        variant: "destructive",
      });
      return null;
    }
  }, [formData.address, formData.id, toast]);
  
  return { fetchNearbyCities };
}
