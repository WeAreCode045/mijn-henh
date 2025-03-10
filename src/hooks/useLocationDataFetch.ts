
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useLocationDataFetch(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Function to fetch location data using Google Maps API
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
        body: { address: formData.address }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log("Location data fetched:", data);
        
        // Update form data with the fetched information
        if (data.latitude) onFieldChange('latitude', data.latitude);
        if (data.longitude) onFieldChange('longitude', data.longitude);
        if (data.map_image) onFieldChange('map_image', data.map_image);
        if (data.nearby_places) onFieldChange('nearby_places', data.nearby_places);
        if (data.nearby_cities) onFieldChange('nearby_cities', data.nearby_cities);
        
        toast({
          title: "Success",
          description: "Location data fetched successfully",
        });
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch location data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData.address, onFieldChange, toast]);
  
  // Function to generate location description using OpenAI
  const generateLocationDescription = useCallback(async () => {
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
      const { data, error } = await supabase.functions.invoke('generate-location-description', {
        body: { 
          address: formData.address,
          nearbyPlaces: formData.nearby_places || []
        }
      });
      
      if (error) throw error;
      
      if (data && data.description) {
        console.log("Generated description:", data.description);
        onFieldChange('location_description', data.description);
        
        toast({
          title: "Success",
          description: "Location description generated successfully",
        });
      }
    } catch (error) {
      console.error("Error generating location description:", error);
      toast({
        title: "Error",
        description: "Failed to generate location description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData.address, formData.nearby_places, onFieldChange, toast]);
  
  // Function to remove a nearby place
  const removeNearbyPlace = useCallback((index: number) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    onFieldChange('nearby_places', updatedPlaces);
  }, [formData.nearby_places, onFieldChange]);
  
  return { 
    fetchLocationData, 
    generateLocationDescription, 
    removeNearbyPlace,
    isLoading
  };
}
