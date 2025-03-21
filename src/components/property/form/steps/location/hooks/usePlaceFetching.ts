
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

  // Function to handle fetching places by category or subtype
  const handleFetchCategory = async (categoryId: string, subtypeId?: string) => {
    if (!onFetchNearbyPlaces) return;
    
    const typeToFetch = subtypeId || categoryId;
    setIsFetchingCategory(true);
    setCurrentCategory(typeToFetch);
    
    try {
      console.log(`Fetching places for: ${typeToFetch}`);
      const results = await onFetchNearbyPlaces(typeToFetch);
      
      if (results && results[typeToFetch] && Array.isArray(results[typeToFetch])) {
        console.log(`Got results for ${typeToFetch}:`, results[typeToFetch]);
        
        // Make sure we're only showing places for the requested category
        const options: PlaceOption[] = results[typeToFetch].map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: typeToFetch,
          maxSelections: getMaxSelections(typeToFetch)
        }));
        
        // Sort by rating if available
        options.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        setPlacesForModal(options);
        setModalOpen(true);
      } else {
        console.log('No results found or unexpected format:', results);
        toast({
          title: "No places found",
          description: `No ${typeToFetch.replace('_', ' ')} places found near this location.`,
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
    try {
      setIsFetchingCategory(true);
      await onFetchNearbyPlaces();
      toast({
        title: "Success",
        description: "All nearby places fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching all places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch all nearby places.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingCategory(false);
    }
  };

  return {
    isFetchingCategory,
    handleFetchCategory,
    handleFetchAllPlaces
  };
}
