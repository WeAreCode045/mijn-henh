
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
      
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          category: category,
          propertyId: formData.id
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
  }, [formData.address, formData.id, toast]);
  
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
