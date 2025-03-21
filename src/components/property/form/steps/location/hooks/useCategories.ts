
import { School, ShoppingBag, Bus, Map, DumbbellIcon, Utensils, GraduationCap, Coffee, BadgeDollarSign, LucideIcon } from "lucide-react";
import { PropertyNearbyPlace } from "@/types/property";

export type CategoryType = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  subtypes?: {
    id: string;
    label: string;
    maxSelections: number;
  }[];
  maxSelections: number;
};

export function useCategories() {
  // Define categories with their corresponding icons and styles
  const categories: CategoryType[] = [
    {
      id: 'education',
      label: 'Education',
      icon: School,
      color: 'bg-blue-50',
      subtypes: [
        { id: 'school', label: 'Schools', maxSelections: 3 },
        { id: 'university', label: 'Universities', maxSelections: 2 }
      ],
      maxSelections: 5
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-amber-50',
      subtypes: [
        { id: 'shopping_mall', label: 'Shopping Malls', maxSelections: 3 },
        { id: 'supermarket', label: 'Supermarkets', maxSelections: 3 }
      ],
      maxSelections: 5
    },
    {
      id: 'transportation',
      label: 'Transportation',
      icon: Bus,
      color: 'bg-green-50',
      subtypes: [
        { id: 'transit_station', label: 'Transit Stations', maxSelections: 3 },
        { id: 'bus_station', label: 'Bus Stations', maxSelections: 3 },
        { id: 'train_station', label: 'Train Stations', maxSelections: 2 }
      ],
      maxSelections: 5
    },
    {
      id: 'entertainment',
      label: 'Entertainment',
      icon: Coffee,
      color: 'bg-purple-50',
      subtypes: [
        { id: 'restaurant', label: 'Restaurants', maxSelections: 5 },
        { id: 'movie_theater', label: 'Movie Theaters', maxSelections: 2 },
        { id: 'park', label: 'Parks', maxSelections: 3 },
        { id: 'museum', label: 'Museums', maxSelections: 3 },
        { id: 'night_club', label: 'Night Clubs', maxSelections: 2 }
      ],
      maxSelections: 10
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: DumbbellIcon,
      color: 'bg-red-50',
      subtypes: [
        { id: 'gym', label: 'Gyms', maxSelections: 3 },
        { id: 'stadium', label: 'Stadiums', maxSelections: 2 }
      ],
      maxSelections: 5
    },
    {
      id: 'other',
      label: 'Other',
      icon: Map,
      color: 'bg-gray-50',
      maxSelections: 5
    }
  ];

  // Function to group places by category
  const groupPlacesByCategory = (places: PropertyNearbyPlace[]) => {
    const result: Record<string, PropertyNearbyPlace[]> = {};
    
    // Initialize categories with empty arrays
    categories.forEach(category => {
      result[category.id] = [];
    });
    
    // Categorize each place
    places.forEach(place => {
      const type = place.type?.toLowerCase() || '';
      
      if (type.includes('school') || type.includes('education') || type.includes('university')) {
        result['education'].push(place);
      } else if (type.includes('shop') || type.includes('store') || type.includes('supermarket') || type.includes('mall')) {
        result['shopping'].push(place);
      } else if (type.includes('bus') || type.includes('train') || type.includes('transit') || type.includes('station')) {
        result['transportation'].push(place);
      } else if (
        type.includes('restaurant') || type.includes('cafe') || 
        type.includes('bar') || type.includes('movie') || 
        type.includes('theater') || type.includes('cinema') || 
        type.includes('park') || type.includes('museum') || 
        type.includes('gallery') || type.includes('night_club') || 
        type.includes('entertainment') || type.includes('amusement') || 
        type.includes('aquarium') || type.includes('casino') || 
        type.includes('tourist') || type.includes('zoo')
      ) {
        result['entertainment'].push(place);
      } else if (type.includes('gym') || type.includes('fitness') || type.includes('sport') || type.includes('stadium')) {
        result['sports'].push(place);
      } else {
        result['other'].push(place);
      }
    });
    
    return result;
  };

  // Function to determine the maximum number of selectable places for a category or subtype
  const getMaxSelections = (typeId: string): number => {
    // Check if it's a main category
    const category = categories.find(c => c.id === typeId);
    if (category) {
      return category.maxSelections;
    }
    
    // Check if it's a subtype
    for (const category of categories) {
      if (category.subtypes) {
        const subtype = category.subtypes.find(s => s.id === typeId);
        if (subtype) {
          return subtype.maxSelections;
        }
      }
    }
    
    // Default if not found
    return 5;
  };

  return {
    categories,
    groupPlacesByCategory,
    getMaxSelections
  };
}
