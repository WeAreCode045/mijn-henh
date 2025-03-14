
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useLocationDataFetch(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
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
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          propertyId: formData.id
        }
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
  }, [formData.address, formData.id, onFieldChange, toast]);
  
  // Function to fetch places for a specific category
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
  
  // Function to fetch only nearby cities
  const fetchNearbyCities = useCallback(async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address: formData.address,
          citiesOnly: true,
          propertyId: formData.id
        }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log("Nearby cities fetched:", data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities",
        variant: "destructive",
      });
      return null;
    }
  }, [formData.address, formData.id, toast]);
  
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
          nearbyPlaces: formData.nearby_places || [],
          language: 'nl'
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
  
  // Function to generate map image
  const generateMapImage = useCallback(async () => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Please fetch location data first to get coordinates",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingMap(true);
    
    try {
      const { data: settings } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (!settings?.google_maps_api_key) {
        throw new Error("Google Maps API key not configured");
      }
      
      const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${formData.latitude},${formData.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${formData.latitude},${formData.longitude}&key=${settings.google_maps_api_key}`;
      
      onFieldChange('map_image', mapImageUrl);
      
      // If we have an ID, update the property in the database
      if (formData.id) {
        await supabase
          .from('properties')
          .update({ map_image: mapImageUrl })
          .eq('id', formData.id);
      }
      
      toast({
        title: "Success",
        description: "Map image generated successfully",
      });
    } catch (error) {
      console.error("Error generating map image:", error);
      toast({
        title: "Error",
        description: "Failed to generate map image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMap(false);
    }
  }, [formData.latitude, formData.longitude, formData.id, onFieldChange, toast]);
  
  // Function to remove a nearby place
  const removeNearbyPlace = useCallback((index: number) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    onFieldChange('nearby_places', updatedPlaces);
  }, [formData.nearby_places, onFieldChange]);
  
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
