
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PropertyFormData, PropertyPlaceType } from '@/types/property';

interface FetchLocationResponse {
  latitude: number;
  longitude: number;
  mapImage: string;
  nearbyPlaces: PropertyPlaceType[];
  nearbyCities?: Array<{name: string, distance: number}>;
  locationDescription?: string;
}

export function useLocationDataFetch(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLocationData = async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter a property address first",
        variant: "destructive"
      });
      return;
    }

    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property must be saved before fetching location data",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: settings } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key, openai_api_key')
        .single();

      if (!settings?.google_maps_api_key) {
        toast({
          title: "Missing API Key",
          description: "Google Maps API key is not configured in agency settings",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('Fetching location data from Supabase edge function');
      
      // Call the Supabase edge function to fetch location data
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: {
          address: formData.address,
          apiKey: settings.google_maps_api_key,
          propertyId: formData.id,
          openaiApiKey: settings.openai_api_key
        }
      });

      if (error) {
        throw new Error(`Error fetching location data: ${error.message}`);
      }

      if (!data || !data.data) {
        throw new Error('No data returned from location service');
      }

      const responseData = data.data as FetchLocationResponse;

      // Update form with fetched data
      onFieldChange('latitude', responseData.latitude);
      onFieldChange('longitude', responseData.longitude);
      onFieldChange('map_image', responseData.mapImage);
      onFieldChange('nearby_places', responseData.nearbyPlaces);
      
      if (responseData.nearbyCities) {
        onFieldChange('nearby_cities', responseData.nearbyCities);
      }
      
      if (responseData.locationDescription) {
        onFieldChange('location_description', responseData.locationDescription);
      }

      toast({
        title: "Success",
        description: "Location data fetched successfully"
      });
    } catch (error: any) {
      console.error('Error fetching location data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch location data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeNearbyPlace = (index: number) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    onFieldChange('nearby_places', updatedPlaces);
  };

  return {
    fetchLocationData,
    removeNearbyPlace,
    isLoading
  };
}
