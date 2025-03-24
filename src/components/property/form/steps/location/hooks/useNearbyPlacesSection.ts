
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function useNearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  onRemoveNearbyPlace
}: {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onRemoveNearbyPlace?: (index: number) => void;
}) {
  const [activeTab, setActiveTab] = useState("view");
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const { toast } = useToast();
  
  const handleRemovePlace = useCallback((index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
      return;
    }
    
    if (!formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.filter((_, i) => i !== index);
    onFieldChange('nearby_places', updatedPlaces);
    
    toast({
      title: "Removed",
      description: "Nearby place removed successfully",
    });
  }, [formData.nearby_places, onFieldChange, onRemoveNearbyPlace, toast]);
  
  const fetchPlaces = useCallback(async (category: string) => {
    if (!onFetchCategoryPlaces) return;
    
    try {
      console.log("Fetching places for category:", category);
      const result = await onFetchCategoryPlaces(category);
      
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
        } else {
          toast({
            title: "Info",
            description: "No nearby places found in this category",
          });
        }
      }
      
      return result;
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
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    
    if (onFetchCategoryPlaces) {
      await fetchPlaces(category);
    }
  }, [fetchPlaces, onFetchCategoryPlaces]);
  
  // Function to save selected places to the property
  const handleSavePlaces = useCallback((selectedPlaces: PropertyNearbyPlace[]) => {
    // Filter out duplicates based on place ID
    const existingIds = new Set((formData.nearby_places || []).map(place => place.id));
    const newPlaces = selectedPlaces.filter(place => !existingIds.has(place.id));
    
    // Combine existing and new places
    const updatedPlaces = [
      ...(formData.nearby_places || []),
      ...newPlaces
    ];
    
    // Update form data
    onFieldChange('nearby_places', updatedPlaces);
    
    // Close modal and clear results
    setShowSelectionModal(false);
    setSearchResults([]);
    
    // Show toast
    toast({
      title: "Success",
      description: `Added ${newPlaces.length} places to the property`,
    });
  }, [formData.nearby_places, onFieldChange, toast]);

  return {
    activeTab,
    setActiveTab,
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick,
    handleSavePlaces,
    handleRemovePlace
  };
}
