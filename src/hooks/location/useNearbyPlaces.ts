
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlaces = useCallback(async (category: string): Promise<any> => {
    // Validate required parameters
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby places",
        variant: "destructive"
      });
      return null;
    }
    
    // Validate property ID
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is required to fetch nearby places. Please save the property first.",
        variant: "destructive"
      });
      return null;
    }
    
    console.log(`Fetching nearby places for category: ${category}`);
    console.log(`Coordinates: ${formData.latitude}, ${formData.longitude}`);
    console.log(`Property ID: ${formData.id}`);
    
    setIsLoading(true);
    
    try {
      // Get Google Maps API key from settings first
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      console.log("Using API key from settings:", apiKey ? "API key found" : "No API key found");
      
      if (!apiKey) {
        console.error("No Google Maps API key found in settings");
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }
      
      // Make direct API call to Google Places API instead of using the edge function
      const radius = 5000; // 5km radius
      const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${formData.latitude},${formData.longitude}&radius=${radius}&type=${category}&key=${apiKey}`;
      
      // Use a CORS proxy for client-side requests to Google's API
      // Note: In production, you might need a proper CORS proxy or a small serverless function
      // We're using a temporary approach for demo purposes
      const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${placesApiUrl}`;
      
      console.log("Calling Google Places API directly");
      
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
      
      if (!placesData.results || !Array.isArray(placesData.results)) {
        console.log("No results found from Places API");
        toast({
          title: "No places found",
          description: `No ${category} places found near this location.`,
          variant: "default"
        });
        setIsLoading(false);
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
      
      // For a single category search, add the places to the current list
      if (category && transformedPlaces.length > 0) {
        const existingPlaces = formData.nearby_places || [];
        const newPlaces = transformedPlaces as PropertyNearbyPlace[];
        
        // Combine existing and new places, avoiding duplicates by ID
        const combinedPlaces = [
          ...existingPlaces,
          ...newPlaces.filter(newPlace => 
            !existingPlaces.some(existingPlace => existingPlace.id === newPlace.id)
          )
        ];
        
        // Update the form data with the combined places
        onFieldChange("nearby_places", combinedPlaces);
        
        toast({
          title: "Places found",
          description: `Found ${newPlaces.length} ${category} places nearby.`
        });
      } else {
        toast({
          title: "No places found",
          description: `No ${category} places found near this location.`,
          variant: "default"
        });
      }
      
      // Return the results in the same format expected by the components
      const result = { [category]: transformedPlaces };
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("Error in fetchPlaces:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places. Please try again.`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [formData.id, formData.latitude, formData.longitude, formData.nearby_places, onFieldChange, toast]);

  const removePlaceAtIndex = useCallback((index: number) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    
    onFieldChange("nearby_places", updatedPlaces);
    
    toast({
      title: "Place removed",
      description: "Nearby place has been removed successfully"
    });
  }, [formData.nearby_places, onFieldChange, toast]);

  return {
    fetchPlaces,
    removePlaceAtIndex,
    isLoading
  };
}
