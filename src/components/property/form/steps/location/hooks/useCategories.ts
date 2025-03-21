
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
        { id: 'preschool', label: 'Preschools', maxSelections: 3 },
        { id: 'primary_school', label: 'Primary Schools', maxSelections: 3 },
        { id: 'school', label: 'Schools', maxSelections: 3 },
        { id: 'secondary_school', label: 'Secondary Schools', maxSelections: 3 },
        { id: 'university', label: 'Universities', maxSelections: 3 }
      ],
      maxSelections: 5
    },
    {
      id: 'entertainment',
      label: 'Entertainment',
      icon: Coffee,
      color: 'bg-purple-50',
      subtypes: [
        { id: 'zoo', label: 'Zoos', maxSelections: 3 },
        { id: 'tourist_attraction', label: 'Tourist Attractions', maxSelections: 3 },
        { id: 'park', label: 'Parks', maxSelections: 3 },
        { id: 'night_club', label: 'Night Clubs', maxSelections: 3 },
        { id: 'movie_theater', label: 'Movie Theaters', maxSelections: 3 },
        { id: 'event_venue', label: 'Event Venues', maxSelections: 3 },
        { id: 'concert_hall', label: 'Concert Halls', maxSelections: 3 }
      ],
      maxSelections: 10
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-amber-50',
      subtypes: [
        { id: 'supermarket', label: 'Supermarkets', maxSelections: 3 },
        { id: 'shopping_mall', label: 'Shopping Malls', maxSelections: 3 }
      ],
      maxSelections: 5
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: DumbbellIcon,
      color: 'bg-red-50',
      subtypes: [
        { id: 'arena', label: 'Arenas', maxSelections: 3 },
        { id: 'fitness_center', label: 'Fitness Centers', maxSelections: 3 },
        { id: 'golf_course', label: 'Golf Courses', maxSelections: 3 },
        { id: 'gym', label: 'Gyms', maxSelections: 3 },
        { id: 'sports_complex', label: 'Sports Complexes', maxSelections: 3 },
        { id: 'stadium', label: 'Stadiums', maxSelections: 3 },
        { id: 'swimming_pool', label: 'Swimming Pools', maxSelections: 3 }
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
      
      if (type.includes('school') || type.includes('education') || type.includes('university') || 
          type === 'preschool' || type === 'primary_school' || type === 'secondary_school') {
        result['education'].push(place);
      } else if (
        type === 'zoo' || type === 'tourist_attraction' || type === 'park' || 
        type === 'night_club' || type === 'movie_theater' || type === 'event_venue' || 
        type === 'concert_hall' || type.includes('entertainment') || type.includes('amusement') || 
        type.includes('aquarium') || type.includes('casino') || type.includes('gallery') || 
        type.includes('museum')
      ) {
        result['entertainment'].push(place);
      } else if (type === 'supermarket' || type === 'shopping_mall' || type.includes('shop') || type.includes('store')) {
        result['shopping'].push(place);
      } else if (
        type === 'arena' || type === 'fitness_center' || type === 'golf_course' || 
        type === 'gym' || type === 'sports_complex' || type === 'stadium' || 
        type === 'swimming_pool' || type.includes('sport') || type.includes('fitness')
      ) {
        result['sports'].push(place);
      } else if (type.includes('bus') || type.includes('train') || type.includes('transit') || type.includes('station')) {
        result['transportation'].push(place);
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

  // Function to get a category's color based on type
  const getCategoryColor = (type: string): string => {
    // First check if it's a main category
    const mainCategory = categories.find(c => c.id === type);
    if (mainCategory) {
      return mainCategory.color;
    }
    
    // Then check if it's a subtype and get its parent category color
    for (const category of categories) {
      if (category.subtypes) {
        const hasSubtype = category.subtypes.some(s => s.id === type);
        if (hasSubtype) {
          return category.color;
        }
      }
    }
    
    // Try to match by type inclusion
    if (type.includes('school') || type.includes('education') || type.includes('university')) {
      return 'bg-blue-50';
    } else if (
      type.includes('entertainment') || type.includes('park') || 
      type.includes('theater') || type.includes('museum') || 
      type.includes('zoo') || type.includes('attraction')
    ) {
      return 'bg-purple-50';
    } else if (type.includes('shop') || type.includes('mall') || type.includes('store') || type.includes('market')) {
      return 'bg-amber-50';
    } else if (type.includes('sport') || type.includes('gym') || type.includes('stadium') || type.includes('arena')) {
      return 'bg-red-50';
    } else if (type.includes('bus') || type.includes('train') || type.includes('transit')) {
      return 'bg-green-50';
    }
    
    // Default to 'other' color if no match
    return 'bg-gray-50';
  };

  // Function to get a category's icon based on type
  const getCategoryIcon = (type: string): LucideIcon => {
    // First check if it's a main category
    const mainCategory = categories.find(c => c.id === type);
    if (mainCategory) {
      return mainCategory.icon;
    }
    
    // Then check if it's a subtype and get its parent category icon
    for (const category of categories) {
      if (category.subtypes) {
        const hasSubtype = category.subtypes.some(s => s.id === type);
        if (hasSubtype) {
          return category.icon;
        }
      }
    }
    
    // Try to match by type inclusion
    if (type.includes('school') || type.includes('education') || type.includes('university')) {
      return School;
    } else if (
      type.includes('entertainment') || type.includes('park') || 
      type.includes('theater') || type.includes('museum') || 
      type.includes('zoo') || type.includes('attraction')
    ) {
      return Coffee;
    } else if (type.includes('shop') || type.includes('mall') || type.includes('store') || type.includes('market')) {
      return ShoppingBag;
    } else if (type.includes('sport') || type.includes('gym') || type.includes('stadium') || type.includes('arena')) {
      return DumbbellIcon;
    } else if (type.includes('bus') || type.includes('train') || type.includes('transit')) {
      return Bus;
    }
    
    // Default to 'other' icon if no match
    return Map;
  };

  return {
    categories,
    groupPlacesByCategory,
    getMaxSelections,
    getCategoryColor,
    getCategoryIcon
  };
}
