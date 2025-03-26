
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";

/**
 * Groups places by their category for display purposes
 */
export function groupPlacesByCategory(places: PropertyNearbyPlace[]): Record<string, PropertyNearbyPlace[]> {
  const grouped = places.reduce((acc, place) => {
    // Use the category if available, otherwise use the type as fallback
    const category = place.category || place.type || 'Other';
    
    if (!acc[category as string]) {
      acc[category as string] = [];
    }
    
    acc[category as string].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);
  
  return grouped;
}
