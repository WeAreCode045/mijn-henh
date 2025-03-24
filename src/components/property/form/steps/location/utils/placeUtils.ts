
import { PropertyNearbyPlace } from "@/types/property";

/**
 * Formats a category name for better readability
 */
export function formatCategoryName(category: string): string {
  // Convert from API format (e.g. shopping_mall) to display format (e.g. Shopping Mall)
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Groups places by their category for display
 */
export function groupPlacesByCategory(places: PropertyNearbyPlace[]): Record<string, PropertyNearbyPlace[]> {
  const grouped: Record<string, PropertyNearbyPlace[]> = {};
  
  places.forEach(place => {
    // Use category as the primary grouping if it exists
    const displayCategory = place.category || formatCategoryName(place.type);
    
    if (!grouped[displayCategory]) {
      grouped[displayCategory] = [];
    }
    
    grouped[displayCategory].push(place);
  });
  
  return grouped;
}
