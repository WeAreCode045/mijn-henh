
import { PropertyNearbyPlace } from "@/types/property";

export type Category = {
  id: string;
  label: string;
};

export function useCategories() {
  // Define standard categories for nearby places
  const categories: Category[] = [
    { id: "restaurant", label: "Restaurants" },
    { id: "education", label: "Education" },
    { id: "supermarket", label: "Supermarkets" },
    { id: "shopping", label: "Shopping" },
    { id: "sport", label: "Sport Facilities" },
    { id: "leisure", label: "Leisure" }
  ];
  
  // Group places by category
  const groupPlacesByCategory = (nearbyPlaces: PropertyNearbyPlace[]) => {
    const placesByCategory: Record<string, PropertyNearbyPlace[]> = {
      all: [...nearbyPlaces]
    };
    
    nearbyPlaces.forEach((place) => {
      const category = place.type || 'other';
      if (!placesByCategory[category]) {
        placesByCategory[category] = [];
      }
      placesByCategory[category].push(place);
    });
    
    return placesByCategory;
  };
  
  return {
    categories,
    groupPlacesByCategory
  };
}
