
import { useCallback, useEffect } from 'react';
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
      return null;
    }
    
    if (!formData.id) {
      toast({
        title: "Error", 
        description: "Please save the property first before fetching location data",
        variant: "destructive",
      });
      return null;
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
        
        // Also trigger map generation immediately after coordinates are fetched
        if (data.latitude && data.longitude) {
          generateMapWithCoordinates(data.latitude, data.longitude);
        }
        
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

    // New function to generate map with coordinates
    async function generateMapWithCoordinates(latitude: number, longitude: number) {
      try {
        const { data: settings } = await supabase
          .from('agency_settings')
          .select('google_maps_api_key')
          .single();
        
        if (!settings?.google_maps_api_key) {
          throw new Error("Google Maps API key not configured");
        }
        
        const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${settings.google_maps_api_key}`;
        
        onFieldChange('map_image', mapImageUrl);
        
        if (formData.id) {
          await supabase
            .from('properties')
            .update({ map_image: mapImageUrl })
            .eq('id', formData.id);
        }
        
        toast({
          title: "Success",
          description: "Map image generated automatically",
        });
      } catch (error) {
        console.error("Error generating map image:", error);
        toast({
          title: "Error",
          description: "Failed to generate map image",
          variant: "destructive",
        });
      }
    }
  }, [formData.address, formData.id, onFieldChange, toast, setIsLoading]);
  
  // Automatically fetch coordinates when address changes and has a value
  useEffect(() => {
    if (formData.address && formData.id) {
      const timer = setTimeout(() => {
        fetchLocationData();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.address, formData.id, fetchLocationData]);
  
  return { fetchLocationData };
}
