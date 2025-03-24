import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";

// Category definitions with their included types
const categoryConfig = {
  "Food & Drinks": ["restaurant", "bar", "cafe"],
  "Nightlife & Entertainment": ["casino", "concert_hall", "event_venue", "night_club", "movie_theater"],
  "Education": ["school", "university", "library", "preschool", "primary_school", "secondary_school"],
  "Sports": ["gym", "arena", "fitness_center", "golf_course", "ski_resort", "sports_club", "sports_complex", "stadium", "swimming_pool"],
  "Shopping": ["supermarket", "shopping_mall"]
};

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
  const { toast } = useToast();

  const fetchPlaces = useCallback(async (categoryName: string): Promise<any> => {
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
    
    console.log(`useNearbyPlaces: Fetching nearby places for category: ${categoryName}`);
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
      
      // Get the types for this category from our config
      const types = categoryConfig[categoryName as keyof typeof categoryConfig];
      
      if (!types || types.length === 0) {
        console.log(`useNearbyPlaces: No types found for category ${categoryName}, using it as a direct type`);
        // If it's not a predefined category, use it as a single type
        const includedTypes = [categoryName];
        
        // Prepare the request body with the exact structure specified
        const requestBody = {
          includedTypes: includedTypes,
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
        
        console.log("useNearbyPlaces: Calling Google Places API for direct type");
        
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
            description: `No ${categoryName} places found near this location.`,
            variant: "default"
          });
          setIsLoading(false);
          return null;
        }
        
        // Transform the response to match our expected format with category information
        const transformedPlaces = placesData.places.map((place: any) => ({
          id: place.id,
          name: place.displayName?.text || place.name || "Unknown place",
          vicinity: place.formattedAddress || "",
          rating: place.rating || null,
          user_ratings_total: place.userRatingCount || 0,
          type: categoryName,
          types: place.types || [],
          visible_in_webview: true,
          distance: null,
          latitude: place.location?.latitude || null,
          longitude: place.location?.longitude || null,
          category: 'Other' // Default category when searching by specific type
        }));
        
        console.log(`useNearbyPlaces: Found ${transformedPlaces.length} places for single type ${categoryName}`);
        
        // Store the search results
        setSearchResults(transformedPlaces);
        
        // Return the results in the same format expected by the components
        const result = { [categoryName]: transformedPlaces };
        setIsLoading(false);
        return result;
      }
      
      // For a category with multiple types
      console.log(`useNearbyPlaces: Using category ${categoryName} with types:`, types);
      
      // Prepare to store results grouped by type
      const typeResults: Record<string, PropertyNearbyPlace[]> = {};
      const allResults: PropertyNearbyPlace[] = [];
      
      // Prepare the request body with the exact structure specified for multiple types
      const requestBody = {
        includedTypes: types,
        maxResultCount: 30, // Request more for better sorting by type
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
      
      console.log("useNearbyPlaces: Places API request body for category search:", JSON.stringify(requestBody));
      
      // Make direct API call to Google Places API
      const placesApiUrl = 'https://places.googleapis.com/v1/places:searchNearby';
      
      console.log(`useNearbyPlaces: Calling Google Places API for category ${categoryName}`);
      
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
      
      console.log("useNearbyPlaces: Places API raw response for category search:", placesData);
      
      if (!placesData.places || !Array.isArray(placesData.places)) {
        console.log(`useNearbyPlaces: No results found from Places API for category ${categoryName}`);
        toast({
          title: "No places found",
          description: `No ${categoryName} places found near this location.`,
          variant: "default"
        });
        setIsLoading(false);
        return null;
      }
      
      // Group places by type
      placesData.places.forEach((place: any) => {
        // Find the specific type from our requested types that this place matches
        const matchedType = types.find(type => 
          place.types && Array.isArray(place.types) && 
          place.types.includes(type)
        ) || types[0]; // Default to first type if no match
        
        if (!typeResults[matchedType]) {
          typeResults[matchedType] = [];
        }
        
        const transformedPlace: PropertyNearbyPlace = {
          id: place.id,
          name: place.displayName?.text || place.name || "Unknown place",
          vicinity: place.formattedAddress || "",
          rating: place.rating || null,
          user_ratings_total: place.userRatingCount || 0,
          type: matchedType, // Use the specific matched type
          types: place.types || [],
          visible_in_webview: true,
          distance: null,
          latitude: place.location?.latitude || null,
          longitude: place.location?.longitude || null,
          category: categoryName // Store the original category
        };
        
        typeResults[matchedType].push(transformedPlace);
      });
      
      // Sort each type's results by rating (high to low) and limit to 6 per type
      Object.keys(typeResults).forEach(type => {
        typeResults[type].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
        
        // Limit to 6 places per type
        const limitedResults = typeResults[type].slice(0, 6);
        allResults.push(...limitedResults);
      });
      
      console.log(`useNearbyPlaces: Found ${allResults.length} places for category ${categoryName}`);
      
      // Store the search results
      setSearchResults(allResults);
      
      // Return the results in the format expected by the components
      setIsLoading(false);
      return allResults;
      
    } catch (error) {
      console.error("useNearbyPlaces: Error in fetchPlaces:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${categoryName} places. Please try again.`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [formData.id, formData.latitude, formData.longitude, toast]);

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
