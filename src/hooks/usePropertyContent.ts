
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent() {
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();

  // Function to fetch location data using Google Maps API
  const fetchLocationData = useCallback(async (formData: PropertyFormData) => {
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

    setIsLoadingLocationData(true);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          propertyId: formData.id
        }
      });

      if (error) throw error;

      if (data && data.success) {
        toast({
          title: "Success",
          description: "Location data fetched successfully",
        });
        return data;
      } else {
        throw new Error(data?.error || "Failed to fetch location data");
      }
    } catch (error: any) {
      console.error('Error fetching location:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch location data",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingLocationData(false);
    }
  }, [toast]);

  // Function to generate location description using OpenAI
  const generateLocationDescription = useCallback(async (formData: PropertyFormData) => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return null;
    }

    setIsLoadingLocationData(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-location-description', {
        body: { 
          address: formData.address,
          nearbyPlaces: formData.nearby_places || []
        }
      });

      if (error) throw error;

      if (data && data.description) {
        toast({
          title: "Success",
          description: "Location description generated successfully",
        });
        return data.description;
      } else {
        throw new Error(data?.error || "Failed to generate location description");
      }
    } catch (error: any) {
      console.error('Error generating location description:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate location description",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingLocationData(false);
    }
  }, [toast]);

  // Function to generate a map image
  const generateMapImage = useCallback(async (formData: PropertyFormData) => {
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
        description: "Please save the property first before generating a map",
        variant: "destructive",
      });
      return null;
    }

    setIsGeneratingMap(true);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          propertyId: formData.id
        }
      });

      if (error) throw error;

      if (data && data.success && data.map_image) {
        toast({
          title: "Success",
          description: "Map image generated successfully",
        });
        return data.map_image;
      } else {
        throw new Error(data?.error || "Failed to generate map image");
      }
    } catch (error: any) {
      console.error('Error generating map image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate map image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGeneratingMap(false);
    }
  }, [toast]);

  // Function to remove a nearby place
  const removeNearbyPlace = useCallback((formData: PropertyFormData, index: number) => {
    if (!formData.nearby_places) return formData;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    
    return {
      ...formData,
      nearby_places: updatedPlaces
    };
  }, []);

  return { 
    fetchLocationData, 
    generateLocationDescription, 
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap
  };
}
