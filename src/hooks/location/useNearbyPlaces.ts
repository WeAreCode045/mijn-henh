
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';
import { preparePropertiesForJsonField } from '@/hooks/property-form/preparePropertyData';

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void,
  toast: any
) {
  const fetchCategoryPlaces = useCallback(async (category: string) => {
    console.log("fetchCategoryPlaces called with category:", category);
    
    if (!formData.address) {
      console.error("Error: Address is missing");
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return null;
    }
    
    if (!formData.latitude || !formData.longitude) {
      console.error("Error: Coordinates are missing", { 
        latitude: formData.latitude, 
        longitude: formData.longitude 
      });
      toast({
        title: "Error",
        description: "Property coordinates are required. Please set the coordinates first.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      console.log(`Fetching nearby places for category: ${category}`);
      
      // Get agency settings to retrieve the API key
      const { data: settings, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
        
      if (settingsError) {
        console.error("Error fetching API key:", settingsError);
        throw settingsError;
      }
      
      if (!settings?.google_maps_api_key) {
        console.error("Google Maps API key not configured");
        toast({
          title: "Error",
          description: "Google Maps API key not configured in agency settings",
          variant: "destructive",
        });
        return null;
      }
      
      const requestData = { 
        address: formData.address,
        apiKey: settings.google_maps_api_key,
        category: category,
        propertyId: formData.id,
        latitude: formData.latitude,
        longitude: formData.longitude,
        radius: 5000  // 5km radius
      };
      
      console.log("Calling nearby-places Edge Function with data:", {
        address: formData.address,
        category,
        latitude: formData.latitude,
        longitude: formData.longitude,
        propertyId: formData.id,
        // Don't log the API key for security reasons
      });
      
      const { data, error } = await supabase.functions.invoke('nearby-places', {
        body: requestData
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      if (data) {
        console.log(`Places data received for category ${category}:`, data);
        
        // Check if any places were found
        let totalPlaces = 0;
        if (typeof data === 'object' && !Array.isArray(data)) {
          Object.entries(data).forEach(([key, places]) => {
            if (Array.isArray(places)) {
              totalPlaces += places.length;
              console.log(`Category ${key} has ${places.length} places`);
            }
          });
        }
        
        if (totalPlaces === 0) {
          console.log("No places found in the response");
          toast({
            title: "No places found",
            description: `No ${category} places found within 5km of this location.`,
          });
        }
        
        return data;
      }
      
      console.log("No data returned from edge function");
      return null;
    } catch (error) {
      console.error(`Error fetching ${category} places:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places`,
        variant: "destructive",
      });
      return null;
    }
  }, [formData.address, formData.id, formData.latitude, formData.longitude, toast]);
  
  const removeNearbyPlace = useCallback(async (index: number) => {
    if (!formData.nearby_places) return;
    
    try {
      const updatedPlaces = [...formData.nearby_places];
      const removedPlace = updatedPlaces[index];
      updatedPlaces.splice(index, 1);
      
      onFieldChange('nearby_places', updatedPlaces);
      
      if (formData.id) {
        const updatedPlacesJson = preparePropertiesForJsonField(updatedPlaces);
        
        const { error } = await supabase
          .from('properties')
          .update({ nearby_places: updatedPlacesJson })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error removing place from database:", error);
          throw error;
        }
      }
      
      toast({
        title: "Place removed",
        description: `"${removedPlace?.name || 'Place'}" has been removed.`
      });
    } catch (error) {
      console.error("Error removing nearby place:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove place. Please try again."
      });
    }
  }, [formData.nearby_places, formData.id, onFieldChange, toast]);
  
  return { fetchCategoryPlaces, removeNearbyPlace };
}
