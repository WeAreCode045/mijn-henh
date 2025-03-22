import { useMemo } from "react";
import { MapPin, ShoppingBag, GraduationCap, Trees, Bus, Building, Dumbbell } from "lucide-react";

export interface CategoryType {
  id: string;
  label: string;
  icon: any;
  color: string;
  maxSelections?: number;
  subtypes?: SubtypeConfig[];
}

export interface SubtypeConfig {
  id: string;
  label: string;
  maxSelections: number;
}

export function useCategories() {
  // Define all categories with their subtypes
  const categories = useMemo<CategoryType[]>(() => [
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800',
      maxSelections: 5,
      subtypes: [
        { id: 'preschool', label: 'Preschool', maxSelections: 5 },
        { id: 'primary_school', label: 'Primary School', maxSelections: 5 },
        { id: 'school', label: 'School', maxSelections: 5 },
        { id: 'secondary_school', label: 'Secondary School', maxSelections: 5 },
        { id: 'university', label: 'University', maxSelections: 5 }
      ]
    },
    {
      id: 'entertainment',
      label: 'Entertainment & Recreation',
      icon: Trees,
      color: 'bg-green-100 text-green-800',
      maxSelections: 5,
      subtypes: [
        { id: 'zoo', label: 'Zoo', maxSelections: 5 },
        { id: 'tourist_attraction', label: 'Tourist Attraction', maxSelections: 5 },
        { id: 'park', label: 'Park', maxSelections: 5 },
        { id: 'night_club', label: 'Night Club', maxSelections: 5 },
        { id: 'movie_theater', label: 'Movie Theater', maxSelections: 5 },
        { id: 'event_venue', label: 'Event Venue', maxSelections: 5 },
        { id: 'concert_hall', label: 'Concert Hall', maxSelections: 5 }
      ]
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-orange-100 text-orange-800',
      maxSelections: 5,
      subtypes: [
        { id: 'supermarket', label: 'Supermarket', maxSelections: 5 },
        { id: 'shopping_mall', label: 'Shopping Mall', maxSelections: 5 }
      ]
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Dumbbell,
      color: 'bg-purple-100 text-purple-800',
      maxSelections: 5,
      subtypes: [
        { id: 'arena', label: 'Arena', maxSelections: 5 },
        { id: 'fitness_center', label: 'Fitness Center', maxSelections: 5 },
        { id: 'golf_course', label: 'Golf Course', maxSelections: 5 },
        { id: 'gym', label: 'Gym', maxSelections: 5 },
        { id: 'sports_complex', label: 'Sports Complex', maxSelections: 5 },
        { id: 'stadium', label: 'Stadium', maxSelections: 5 },
        { id: 'swimming_pool', label: 'Swimming Pool', maxSelections: 5 }
      ]
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: Bus,
      color: 'bg-yellow-100 text-yellow-800',
      maxSelections: 5
    }
  ], []);

  // Get color by category
  const getCategoryColor = (type: string): string => {
    // First check if the place has a types array and if any of those types match a category
    const category = categories.find(cat => 
      cat.id === type || 
      cat.subtypes?.some(subtype => subtype.id === type)
    );
    
    return category?.color || 'bg-gray-100 text-gray-800';
  };

  // Get icon by category
  const getCategoryIcon = (type: string) => {
    // First check if the place has a types array and if any of those types match a category
    const category = categories.find(cat => 
      cat.id === type || 
      cat.subtypes?.some(subtype => subtype.id === type)
    );
    
    return category?.icon || MapPin;
  };

  // Helper to find a category by type or subtype id
  const findCategoryByType = (typeId: string): CategoryType | undefined => {
    // Check if it's a main category
    const mainCategory = categories.find(cat => cat.id === typeId);
    if (mainCategory) return mainCategory;
    
    // Check if it's a subtype
    return categories.find(cat => 
      cat.subtypes?.some(subtype => subtype.id === typeId)
    );
  };

  // Get max selections for a given type or subtype
  const getMaxSelections = (typeId: string): number => {
    // First check if it's a main category
    const category = categories.find(cat => cat.id === typeId);
    if (category?.maxSelections) return category.maxSelections;
    
    // Then check if it's a subtype
    for (const cat of categories) {
      const subtype = cat.subtypes?.find(sub => sub.id === typeId);
      if (subtype) return subtype.maxSelections;
    }
    
    return 5; // Default max selections
  };

  // Group places by category and limit to max selections per type
  const groupPlacesByCategory = (places: any[]) => {
    const grouped: Record<string, any[]> = {};
    
    // Create a mapping of type to place
    const placesByType: Record<string, any[]> = {};
    
    places.forEach(place => {
      const type = place.type;
      
      if (!placesByType[type]) {
        placesByType[type] = [];
      }
      
      // Add to type-specific array
      placesByType[type].push(place);
    });
    
    // Now assign places to categories, keeping in mind the max selections per type
    Object.entries(placesByType).forEach(([type, typePlaces]) => {
      // Find the parent category for this type
      let categoryId = type;
      
      // Check if this type belongs to a main category
      const parentCategory = findCategoryByType(type);
      if (parentCategory) {
        categoryId = parentCategory.id;
      }
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      
      // Only take up to maxSelections for this type
      const maxForType = getMaxSelections(type);
      const placesToAdd = typePlaces.slice(0, maxForType);
      
      // Add the places to the category
      grouped[categoryId].push(...placesToAdd);
    });
    
    return grouped;
  };

  return {
    categories,
    getCategoryColor,
    getCategoryIcon,
    findCategoryByType,
    getMaxSelections,
    groupPlacesByCategory
  };
}
