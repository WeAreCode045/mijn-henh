
import { useState } from "react";
import { PlaceOption } from "../components/SelectPlacesModal";
import { useToast } from "@/components/ui/use-toast";

export function usePlaceFetching({
  onFetchNearbyPlaces,
  setPlacesForModal,
  setModalOpen,
  setCurrentCategory,
  getMaxSelections
}: {
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  setPlacesForModal: (places: PlaceOption[]) => void;
  setModalOpen: (open: boolean) => void;
  setCurrentCategory: (category: string) => void;
  getMaxSelections: (typeId: string) => number;
}) {
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const { toast } = useToast();

  // Function to handle fetching places by category
  const handleFetchCategory = async (categoryId: string) => {
    if (!onFetchNearbyPlaces) return;
    
    setIsFetchingCategory(true);
    setCurrentCategory(categoryId);
    
    try {
      console.log(`Fetching places for: ${categoryId}`);
      const results = await onFetchNearbyPlaces(categoryId);
      
      if (results && results[categoryId] && Array.isArray(results[categoryId])) {
        // Make sure we're only showing places for the requested category
        const options: PlaceOption[] = results[categoryId].map((place: any) => ({
          id: place.id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: place.type,
          types: place.types,
          maxSelections: getMaxSelections(place.type)
        }));
        
        // Sort by rating
        options.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        setPlacesForModal(options);
        setModalOpen(true);
      } else {
        toast({
          title: "No places found",
          description: `No ${categoryId.replace('_', ' ')} places found near this location.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingCategory(false);
    }
  };

  // Function to handle fetching all places - triggered by button click
  const handleFetchAllPlaces = async (e: React.MouseEvent) => {
    if (!onFetchNearbyPlaces) return;
    
    e.preventDefault();
    await onFetchNearbyPlaces();
  };

  return {
    isFetchingCategory,
    handleFetchCategory,
    handleFetchAllPlaces
  };
}
