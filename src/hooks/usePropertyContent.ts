
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent(formData: PropertyFormData, onFieldChange: (field: keyof PropertyFormData, value: any) => void) {
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
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

  // Handle form submission
  const onSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save the property
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setPendingChanges(false);
      
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Handle step navigation
  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  return { 
    fetchLocationData, 
    generateLocationDescription, 
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onSubmit,
    currentStep,
    handleStepClick,
    lastSaved,
    isSaving,
    setPendingChanges
  };
}
