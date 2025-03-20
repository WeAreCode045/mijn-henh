
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { preparePropertiesForJsonField } from '@/hooks/property-form/preparePropertyData';

export function useLocationDataFetch(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();
  
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
          propertyId: formData.id,
          coordinatesOnly: true
        }
      });
      
      if (error) throw error;
      
      if (data) {
        console.log("Location data fetched:", data);
        
        if (data.latitude) onFieldChange('latitude', data.latitude);
        if (data.longitude) onFieldChange('longitude', data.longitude);
        
        toast({
          title: "Success",
          description: "Location data fetched successfully",
        });
        
        return data;
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
