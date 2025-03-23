
import { useState } from "react";

export function usePlaceFetching({
  onFetchNearbyPlaces,
  setPlacesForModal,
  setModalOpen,
  setCurrentCategory,
  getMaxSelections,
  isReadOnly = false
}: {
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  setPlacesForModal: (places: any[]) => void;
  setModalOpen: (open: boolean) => void;
  setCurrentCategory: (category: string) => void;
  getMaxSelections: (categoryId: string) => number;
  isReadOnly?: boolean;
}) {
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);

  const handleFetchCategory = async (categoryId: string, subtypeId?: string) => {
    if (isReadOnly || !onFetchNearbyPlaces) return Promise.resolve();
    
    console.log(`Fetching places for category: ${categoryId}${subtypeId ? `, subtype: ${subtypeId}` : ''}`);
    setIsFetchingCategory(true);
    setCurrentCategory(subtypeId || categoryId);
    
    try {
      // Call the API function with the category
      const response = await onFetchNearbyPlaces(subtypeId || categoryId);
      
      if (response && response.places) {
        const maxSelection = getMaxSelections(categoryId);
        const places = response.places.slice(0, maxSelection * 2); // Fetch double the max to give more options
        
        // Set the places for the modal
        setPlacesForModal(places);
        
        // Open the modal to select places
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching places for category:", error);
    } finally {
      setIsFetchingCategory(false);
    }
  };

  const handleFetchAllPlaces = async () => {
    if (isReadOnly || !onFetchNearbyPlaces) return;
    
    // This would fetch places for all categories
    console.log("Fetching places for all categories");
    
    try {
      await onFetchNearbyPlaces();
    } catch (error) {
      console.error("Error fetching all nearby places:", error);
    }
  };

  return {
    isFetchingCategory,
    handleFetchCategory,
    handleFetchAllPlaces
  };
}
