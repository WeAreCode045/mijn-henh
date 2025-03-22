
import { useCallback } from 'react';
import { PropertyFormData } from '@/types/property';

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  // Function to remove a nearby place
  const removeNearbyPlace = useCallback((index: number) => {
    if (!formData.nearby_places) return formData;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    
    onFieldChange('nearby_places', updatedPlaces);
    return {
      ...formData,
      nearby_places: updatedPlaces
    };
  }, [formData, onFieldChange]);

  return {
    removeNearbyPlace
  };
}
