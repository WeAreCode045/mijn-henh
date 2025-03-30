
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";

export function groupPlacesByCategory(places: PropertyNearbyPlace[]): Record<string, PropertyNearbyPlace[]> {
  return places.reduce((acc, place) => {
    const category = place.category || place.type || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);
}

export function getCategoriesWithCounts(places: PropertyNearbyPlace[]): { name: string; count: number }[] {
  const grouped = groupPlacesByCategory(places);
  return Object.keys(grouped).map(category => ({
    name: category,
    count: grouped[category].length
  }));
}
