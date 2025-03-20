
import { PropertyFormData } from '@/types/property';
import { useLocationBase } from './useLocationBase';
import { useLocationCoordinates } from './useLocationCoordinates';
import { useNearbyPlaces } from './useNearbyPlaces';
import { useNearbyCities } from './useNearbyCities';
import { useLocationDescription } from './useLocationDescription';
import { useMapGeneration } from './useMapGeneration';

export function useLocationDataFetch(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const { 
    isLoading, 
    setIsLoading, 
    isGeneratingMap, 
    setIsGeneratingMap, 
    toast 
  } = useLocationBase(formData, onFieldChange);
  
  const { fetchLocationData } = useLocationCoordinates(
    formData, 
    onFieldChange, 
    setIsLoading, 
    toast
  );
  
  const { fetchCategoryPlaces, removeNearbyPlace } = useNearbyPlaces(
    formData, 
    onFieldChange, 
    toast
  );
  
  const { fetchNearbyCities } = useNearbyCities(formData, toast);
  
  const { generateLocationDescription } = useLocationDescription(
    formData, 
    onFieldChange, 
    setIsLoading, 
    toast
  );
  
  const { generateMapImage } = useMapGeneration(
    formData, 
    onFieldChange, 
    setIsGeneratingMap, 
    toast
  );
  
  return {
    fetchLocationData,
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    isLoading,
    isGeneratingMap
  };
}
