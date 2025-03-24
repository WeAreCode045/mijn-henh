
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";

/**
 * Groups places by their category for display purposes
 * If a place has a category, that's used; otherwise falls back to type
 */
export function groupPlacesByCategory(places: PropertyNearbyPlace[]): Record<string, PropertyNearbyPlace[]> {
  const grouped = places.reduce((acc, place) => {
    // Use the category if available, otherwise use the type as fallback
    const category = place.category || place.type || 'Other';
    
    // Format category/type name to be more readable
    const formattedCategory = formatCategoryName(category);
    
    if (!acc[formattedCategory]) {
      acc[formattedCategory] = [];
    }
    
    acc[formattedCategory].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);
  
  return grouped;
}

/**
 * Formats a category or type name to be more readable
 * Capitalizes first letter and removes underscores
 */
function formatCategoryName(category: string): string {
  // Convert to lowercase first to standardize
  const formatted = category.toLowerCase()
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, c => c.toUpperCase());
  
  // Map common API response categories to more user-friendly names
  const categoryMap: Record<string, string> = {
    'Restaurant': 'Restaurants',
    'Food': 'Food & Dining',
    'School': 'Education',
    'University': 'Education',
    'Park': 'Parks & Recreation',
    'Hospital': 'Healthcare',
    'Transit': 'Transportation',
    'Train Station': 'Transportation',
    'Bus Station': 'Transportation',
    'Shopping': 'Shopping',
    'Store': 'Shopping',
    'Supermarket': 'Shopping',
    'Gym': 'Sports & Fitness'
  };
  
  return categoryMap[formatted] || formatted;
}
