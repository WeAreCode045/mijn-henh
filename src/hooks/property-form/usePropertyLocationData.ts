
import { useCallback, useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyLocationData(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();
  
  const onFetchLocationData = useCallback(async () => {
    if (!formState.address) return;
    
    setIsLoadingLocationData(true);
    
    try {
      // Mock implementation
      console.log("Fetching location data for address:", formState.address);
      
      setTimeout(() => {
        setIsLoadingLocationData(false);
        setPendingChanges(true);
      }, 1000);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setIsLoadingLocationData(false);
    }
  }, [formState.address, setPendingChanges]);
  
  const onGenerateLocationDescription = useCallback(async () => {
    if (!formState.address) return;
    
    setIsLoadingLocationData(true);
    
    try {
      // Get OpenAI API key from settings first
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('openai_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        setIsLoadingLocationData(false);
        throw new Error("Could not fetch OpenAI API key from settings");
      }
      
      const apiKey = settingsData?.openai_api_key;
      
      if (!apiKey) {
        console.error("No OpenAI API key found in settings");
        setIsLoadingLocationData(false);
        toast({
          title: "Missing API Key",
          description: "Please set an OpenAI API key in your agency settings",
          variant: "destructive"
        });
        return;
      }
      
      // For this implementation, we'll just mock the functionality
      // In a real app, you'd call the OpenAI API directly
      console.log("Generating location description for address:", formState.address);
      
      // Simulate delay for generating description
      setTimeout(() => {
        const mockDescription = `This property is located in a wonderful neighborhood with easy access to local amenities. The surrounding area offers a blend of urban convenience and natural beauty.`;
        
        handleFieldChange('location_description', mockDescription);
        setIsLoadingLocationData(false);
        setPendingChanges(true);
        
        toast({
          title: "Success",
          description: "Location description generated successfully",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating location description:", error);
      setIsLoadingLocationData(false);
      toast({
        title: "Error",
        description: "Failed to generate location description",
        variant: "destructive",
      });
    }
  }, [formState.address, handleFieldChange, setPendingChanges, toast]);
  
  const onGenerateMap = useCallback(async () => {
    if (!formState.latitude || !formState.longitude) return;
    
    setIsGeneratingMap(true);
    
    try {
      // Get Google Maps API key from settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        setIsGeneratingMap(false);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      
      if (!apiKey) {
        console.error("No Google Maps API key found in settings");
        setIsGeneratingMap(false);
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        return;
      }
      
      // In a real app, you'd generate a static map using the Google Maps Static API
      // For this implementation, we'll just mock it
      console.log("Generating map for coordinates:", formState.latitude, formState.longitude);
      
      // Simulate delay for generating map
      setTimeout(() => {
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${formState.latitude},${formState.longitude}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${formState.latitude},${formState.longitude}&key=${apiKey}`;
        
        // In a real app, you'd save this image URL to the property record
        console.log("Generated map URL:", staticMapUrl);
        
        setIsGeneratingMap(false);
        setPendingChanges(true);
        
        toast({
          title: "Success",
          description: "Map generated successfully",
        });
      }, 1000);
    } catch (error) {
      console.error("Error generating map:", error);
      setIsGeneratingMap(false);
      toast({
        title: "Error",
        description: "Failed to generate map",
        variant: "destructive",
      });
    }
  }, [formState.latitude, formState.longitude, setPendingChanges, toast]);
  
  const onRemoveNearbyPlace = useCallback((index: number) => {
    if (!formState.nearby_places) return;
    
    const updatedPlaces = [...formState.nearby_places];
    updatedPlaces.splice(index, 1);
    
    handleFieldChange("nearby_places", updatedPlaces);
    setPendingChanges(true);
    
    toast({
      title: "Place removed",
      description: "Nearby place has been removed successfully"
    });
  }, [formState.nearby_places, handleFieldChange, setPendingChanges, toast]);
  
  const onFetchCategoryPlaces = useCallback(async (category: string) => {
    if (!formState.latitude || !formState.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby places",
        variant: "destructive"
      });
      return null;
    }
    
    // Validate property ID
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is required to fetch nearby places. Please save the property first.",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoadingLocationData(true);
    
    try {
      // Get Google Maps API key from settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        setIsLoadingLocationData(false);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      
      if (!apiKey) {
        console.error("No Google Maps API key found in settings");
        setIsLoadingLocationData(false);
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        return null;
      }
      
      console.log("Fetching places for category:", category);
      
      // Make direct API call to Google Places API
      const radius = 5000; // 5km radius
      const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${formState.latitude},${formState.longitude}&radius=${radius}&type=${category}&key=${apiKey}`;
      
      // Use a CORS proxy for client-side requests to Google's API
      // Note: In production, you might need a proper CORS proxy or a small serverless function
      // We're using a temporary approach for demo purposes
      const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${placesApiUrl}`;
      
      console.log("Calling Google Places API directly using CORS proxy");
      
      const response = await fetch(corsProxyUrl, {
        headers: {
          'Origin': window.location.origin,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Places API returned status ${response.status}`);
      }
      
      const placesData = await response.json();
      
      console.log("Places API response:", placesData);
      
      if (!placesData.results || !Array.isArray(placesData.results) || placesData.results.length === 0) {
        console.log("No results found from Places API");
        toast({
          title: "No places found",
          description: `No ${category} places found near this location.`,
          variant: "default"
        });
        setIsLoadingLocationData(false);
        return null;
      }
      
      // Transform the response to match our expected format
      const transformedPlaces = placesData.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating || null,
        user_ratings_total: place.user_ratings_total || 0,
        type: category,
        types: place.types || [],
        visible_in_webview: true,
        distance: null, // We could calculate this if needed
        latitude: place.geometry?.location?.lat || null,
        longitude: place.geometry?.location?.lng || null
      }));
      
      console.log(`Found ${transformedPlaces.length} places for category ${category}`);
      
      // Return the results in the same format expected by the components
      const result = { [category]: transformedPlaces };
      setIsLoadingLocationData(false);
      return result;
    } catch (error) {
      console.error("Error fetching category places:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places`,
        variant: "destructive"
      });
      setIsLoadingLocationData(false);
      return null;
    }
  }, [formState.id, formState.latitude, formState.longitude, toast]);
  
  const onFetchNearbyCities = useCallback(async () => {
    if (!formState.latitude || !formState.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby cities",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // In a real app, you'd call a geocoding service to get nearby cities
      // For this implementation, we'll just return mock data
      console.log("Fetching nearby cities");
      
      const mockCities = [
        {
          id: "city-1",
          name: "Nearby City 1",
          distance: 5.2
        },
        {
          id: "city-2",
          name: "Nearby City 2",
          distance: 8.7
        }
      ];
      
      return mockCities;
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities",
        variant: "destructive"
      });
      return null;
    }
  }, [formState.latitude, formState.longitude, toast]);
  
  return {
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onFetchCategoryPlaces,
    onFetchNearbyCities
  };
}
