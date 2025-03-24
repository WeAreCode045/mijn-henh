
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyNearbyPlace } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

// Category definitions with their included types
const categoryConfig = {
  "Food & Drinks": ["restaurant", "bar", "cafe"],
  "Nightlife & Entertainment": ["casino", "concert_hall", "event_venue", "night_club", "movie_theater"],
  "Education": ["school", "university", "library", "preschool", "primary_school", "secondary_school"],
  "Sports": ["gym", "arena", "fitness_center", "golf_course", "ski_resort", "sports_club", "sports_complex", "stadium", "swimming_pool"],
  "Shopping": ["supermarket", "shopping_mall"]
};

interface UseNearbyPlacesSearchProps {
  latitude?: number | null;
  longitude?: number | null;
}

export function useNearbyPlacesSearch({ latitude, longitude }: UseNearbyPlacesSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PropertyNearbyPlace[]>([]);
  const { toast } = useToast();

  const searchPlaces = useCallback(async (categoryName: string): Promise<PropertyNearbyPlace[]> => {
    if (!latitude || !longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to search for nearby places",
        variant: "destructive"
      });
      return [];
    }

    setIsSearching(true);
    setResults([]);

    try {
      // Get Google Maps API key from settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      
      if (!apiKey) {
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        setIsSearching(false);
        return [];
      }

      // Get the types for this category
      const types = categoryConfig[categoryName as keyof typeof categoryConfig] || [];
      
      if (!types.length) {
        console.error(`No types found for category: ${categoryName}`);
        return [];
      }
      
      console.log(`Searching for category ${categoryName} with types:`, types);

      // Search for each type in the category
      const allResults: PropertyNearbyPlace[] = [];
      
      // Make a single request with the first type, but we'll label results with the category name
      const requestBody = {
        includedTypes: types,
        maxResultCount: 20, // More results since we're combining categories
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude
            },
            radius: 5000
          }
        }
      };

      console.log("Places API request:", JSON.stringify(requestBody));

      // Call Google Places API
      const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.location',
          'X-Goog-Api-Key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Places API returned status ${response.status}:`, errorText);
        throw new Error(`Places API returned error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Places API response:", data);

      if (!data.places || !Array.isArray(data.places)) {
        console.log("No places found in response");
        setIsSearching(false);
        return [];
      }

      // Transform the places data and add them to our results
      const transformedPlaces: PropertyNearbyPlace[] = data.places.map((place: any) => ({
        id: place.id,
        name: place.displayName?.text || "Unknown Place",
        vicinity: place.formattedAddress || "",
        rating: place.rating || null,
        user_ratings_total: place.userRatingCount || 0,
        type: categoryName, // Use the category name for display purposes
        types: place.types || [],
        visible_in_webview: true,
        distance: null,
        latitude: place.location?.latitude || null,
        longitude: place.location?.longitude || null
      }));

      console.log(`Found ${transformedPlaces.length} places for category: ${categoryName}`);

      // Update state with results
      setResults(transformedPlaces);
      
      return transformedPlaces;
    } catch (error) {
      console.error("Error searching for places:", error);
      toast({
        title: "Error",
        description: "Failed to search for nearby places",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [latitude, longitude, toast]);

  return {
    searchPlaces,
    isSearching,
    results,
    setResults
  };
}
