
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
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
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
        
      if (settingsError) throw settingsError;
      
      if (!settings?.google_maps_api_key) {
        toast({
          title: "Error",
          description: "Google Maps API key not configured in agency settings",
          variant: "destructive",
        });
        return null;
      }
      
      const { data, error } = await supabase.functions.invoke('nearby-places', {
        body: { 
          address: formData.address,
          apiKey: settings.google_maps_api_key,
          category: category,
          propertyId: formData.id,
          latitude: formData.latitude,
          longitude: formData.longitude,
          radius: 5000  // 5km radius
        }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log(`${category} places fetched:`, data);
        return data;
      }
      
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
