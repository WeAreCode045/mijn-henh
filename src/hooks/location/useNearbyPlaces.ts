
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
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
    
    console.log(`useNearbyPlaces: Fetching nearby places for category: ${category}`);
    console.log(`useNearbyPlaces: Coordinates: ${formData.latitude}, ${formData.longitude}`);
    console.log(`useNearbyPlaces: Property ID: ${formData.id}`);
    
    setIsLoading(true);
    
    try {
      // Get Google Maps API key from settings first
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("useNearbyPlaces: Error fetching API key from settings:", settingsError);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      console.log("useNearbyPlaces: Using API key from settings:", apiKey ? "API key found" : "No API key found");
      
      if (!apiKey) {
        console.error("useNearbyPlaces: No Google Maps API key found in settings");
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }
      
      // Use the category provided or default to "restaurant" for debugging
      const includedType = category || "restaurant";
      
      // Prepare the request body with the exact structure specified
      const requestBody = {
        includedTypes: [includedType],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: formData.latitude,
              longitude: formData.longitude
            },
            radius: 5000
          }
        }
      };
      
      console.log("useNearbyPlaces: Places API request body:", JSON.stringify(requestBody));
      
      // Make direct API call to Google Places API v2
      const placesApiUrl = 'https://places.googleapis.com/v1/places:searchNearby';
      
      console.log("useNearbyPlaces: Calling Google Places API directly");
      
      const response = await fetch(placesApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.location'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`useNearbyPlaces: Places API returned status ${response.status}`, errorText);
        throw new Error(`Places API returned error: ${errorText}`);
      }
      
      const placesData = await response.json();
      
      console.log("useNearbyPlaces: Places API raw response:", placesData);
      
      if (!placesData.places || !Array.isArray(placesData.places)) {
        console.log("useNearbyPlaces: No results found from Places API");
        toast({
          title: "No places found",
          description: `No ${category} places found near this location.`,
          variant: "default"
        });
        setIsLoading(false);
        return null;
      }
      
      // Transform the response to match our expected format
      const transformedPlaces = placesData.places.map((place: any) => ({
        id: place.id,
        name: place.displayName?.text || place.name || "Unknown place",
        vicinity: place.formattedAddress || "",
        rating: place.rating || null,
        user_ratings_total: place.userRatingCount || 0,
        type: category,
        types: place.types || [],
        visible_in_webview: true,
        distance: null, // We could calculate this if needed
        latitude: place.location?.latitude || null,
        longitude: place.location?.longitude || null
      }));
      
      console.log(`useNearbyPlaces: Found ${transformedPlaces.length} places for category ${category}`);
      
      // Store the search results
      setSearchResults(transformedPlaces);
      
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
      console.error("useNearbyPlaces: Error in fetchPlaces:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places. Please try again.`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [formData.id, formData.latitude, formData.longitude, formData.nearby_places, onFieldChange, toast]);

  const saveSelectedPlaces = useCallback((selectedPlaces: PropertyNearbyPlace[]) => {
    if (!formData.id) return;
    
    // Filter out duplicates based on place ID
    const existingPlaces = formData.nearby_places || [];
    const newPlaces = selectedPlaces.filter(newPlace => 
      !existingPlaces.some(existingPlace => existingPlace.id === newPlace.id)
    );
    
    // Combine existing and new places
    const combinedPlaces = [...existingPlaces, ...newPlaces];
    
    // Update the form data with the combined places
    onFieldChange("nearby_places", combinedPlaces);
    
    toast({
      title: "Places saved",
      description: `Added ${newPlaces.length} places to the property`
    });
    
    return combinedPlaces;
  }, [formData.id, formData.nearby_places, onFieldChange, toast]);

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
    saveSelectedPlaces,
    removePlaceAtIndex,
    searchResults,
    isLoading
  };
}
