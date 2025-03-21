
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';

export function useLocationCoordinates(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setIsLoading: (loading: boolean) => void,
  toast: any
) {
  const fetchLocationData = useCallback(async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          propertyId: formData.id,
          coordinatesOnly: true
        }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log("Location data fetched:", data);
        
        if (data.latitude) onFieldChange('latitude', data.latitude);
        if (data.longitude) onFieldChange('longitude', data.longitude);
        
        toast({
          title: "Success",
          description: "Location coordinates fetched successfully",
        });
        
        return data;
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch location coordinates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData.address, formData.id, onFieldChange, toast, setIsLoading]);
  
  return { fetchLocationData };
}
