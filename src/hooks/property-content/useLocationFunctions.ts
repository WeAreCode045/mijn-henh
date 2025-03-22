
import { useCallback, useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useLocationFunctions(
  formData: PropertyFormData, 
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();

  // Function to fetch location data using Google Maps API
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
        
        // Update form data with the fetched information
        if (data.latitude) onFieldChange('latitude', data.latitude);
        if (data.longitude) onFieldChange('longitude', data.longitude);
        if (data.nearby_places) onFieldChange('nearby_places', data.nearby_places);
        if (data.nearby_cities) onFieldChange('nearby_cities', data.nearby_cities);
        
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
  }, [formData.address, formData.id, onFieldChange, toast]);

  // Function to generate location description using OpenAI
  const generateLocationDescription = useCallback(async () => {
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
        onFieldChange('location_description', data.description);
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
  }, [formData.address, formData.nearby_places, onFieldChange, toast]);

  // Function to generate a map image
  const generateMapImage = useCallback(async () => {
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
          propertyId: formData.id,
          generateMap: true
        }
      });

      if (error) throw error;

      if (data && data.success && data.map_image) {
        toast({
          title: "Success",
          description: "Map image generated successfully",
        });
        onFieldChange('map_image', data.map_image);
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
  }, [formData.address, formData.id, onFieldChange, toast]);

  return {
    fetchLocationData,
    generateLocationDescription,
    generateMapImage,
    isLoadingLocationData,
    isGeneratingMap
  };
}
