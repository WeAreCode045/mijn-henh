
import { useState } from "react";
import { PlaceOption } from "../components/SelectPlacesModal";

export function usePlaceFetching({
  onFetchNearbyPlaces,
  setPlacesForModal,
  setModalOpen,
  setCurrentCategory
}: {
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  setPlacesForModal: (places: PlaceOption[]) => void;
  setModalOpen: (open: boolean) => void;
  setCurrentCategory: (category: string) => void;
}) {
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);

  // Function to handle fetching places by category - triggered by button click
  const handleFetchCategory = async (category: string) => {
    if (!onFetchNearbyPlaces) return;
    
    setIsFetchingCategory(true);
    setCurrentCategory(category);
    
    try {
      const results = await onFetchNearbyPlaces(category);
      if (results && results[category]) {
        const options: PlaceOption[] = results[category].map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: category
        }));
        
        setPlacesForModal(options);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsFetchingCategory(false);
    }
  };

  // Function to handle fetching all places - triggered by button click
  const handleFetchAllPlaces = (e: React.MouseEvent) => {
    if (!onFetchNearbyPlaces) return;
    
    e.preventDefault();
    onFetchNearbyPlaces();
  };

  return {
    isFetchingCategory,
    handleFetchCategory,
    handleFetchAllPlaces
  };
}
