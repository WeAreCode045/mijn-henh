import { useState, useCallback } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { ToastApi } from "@/components/ui/use-toast";

export function usePlaceSearchResults({
  formData,
  onFetchCategoryPlaces,
  onSearchClick,
  toast
}: {
  formData: PropertyFormData;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
  toast: ToastApi;
}) {
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  // Function to fetch places by category
  const fetchPlaces = useCallback(async (category: string) => {
    if (!onFetchCategoryPlaces) return null;
    
    try {
      console.log("Starting fetchPlaces for category:", category);
      const result = await onFetchCategoryPlaces(category);
      
      console.log("API response for category:", category, result);
      
      if (result) {
        console.log("Search results:", result);
        // Flatten results if it's an object with category keys
        let places: PropertyNearbyPlace[] = [];
        if (typeof result === 'object' && !Array.isArray(result)) {
          // If result is an object with category keys, flatten all places
          Object.values(result).forEach(categoryPlaces => {
            if (Array.isArray(categoryPlaces)) {
              places = [...places, ...categoryPlaces as PropertyNearbyPlace[]];
            }
          });
        } else if (Array.isArray(result)) {
          places = result;
        }
        
        // Only show results if we have places to show
        if (places.length > 0) {
          console.log("Places to display in modal:", places.length);
          setSearchResults(places);
          setShowSelectionModal(true);
          
          toast({
            title: "Success",
            description: `Found ${places.length} nearby places`,
          });
          
          return places;
        } else {
          console.log("No places found for category:", category);
          toast({
            title: "Info",
            description: "No nearby places found in this category",
          });
          return [];
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places",
        variant: "destructive",
      });
      return null;
    }
  }, [onFetchCategoryPlaces, toast]);

  // Function to handle search button click
  const handleSearchClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    console.log("Search handler called for category:", category);
    e.preventDefault();
    e.stopPropagation();
    
    let results = null;
    
    try {
      if (onSearchClick) {
        // Use the parent component's search handler if provided
        console.log("Using parent onSearchClick handler for category:", category);
        results = await onSearchClick(e, category);
        console.log("Results from parent search handler:", results);
      } else if (onFetchCategoryPlaces) {
        // Otherwise use the default fetch logic
        console.log("Using default fetchPlaces for category:", category);
        results = await fetchPlaces(category);
        console.log("Results from fetchPlaces:", results);
      }
      
      // Process the results
      if (results) {
        console.log("Processing search results:", results);
        let places: PropertyNearbyPlace[] = [];
        
        // Handle different result formats
        if (typeof results === 'object' && !Array.isArray(results)) {
          console.log("Results are an object, flattening categories");
          Object.entries(results).forEach(([categoryKey, categoryPlaces]) => {
            console.log(`Processing category ${categoryKey} with ${Array.isArray(categoryPlaces) ? categoryPlaces.length : 0} places`);
            if (Array.isArray(categoryPlaces)) {
              places = [...places, ...categoryPlaces as PropertyNearbyPlace[]];
            }
          });
        } else if (Array.isArray(results)) {
          console.log("Results are already an array of length:", results.length);
          places = results;
        }
        
        if (places.length > 0) {
          console.log(`Found ${places.length} places to display in modal`);
          setSearchResults(places);
          setShowSelectionModal(true);
        } else {
          console.log("No places found after processing results");
          toast({
            title: "No results",
            description: "No places found in this category. Try another category.",
          });
        }
      } else {
        console.log("No results returned from search");
        toast({
          title: "No results",
          description: "The search did not return any places. Check your location settings or try another category.",
        });
      }
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Error",
        description: "An error occurred while searching for places",
        variant: "destructive",
      });
    }
  }, [fetchPlaces, onFetchCategoryPlaces, onSearchClick, toast]);

  return {
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick
  };
}
