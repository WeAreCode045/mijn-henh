
import { useState, useMemo } from "react";
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
      subtypes: [
        { id: 'preschool', label: 'Preschool', maxSelections: 3 },
        { id: 'primary_school', label: 'Primary School', maxSelections: 3 },
        { id: 'school', label: 'School', maxSelections: 3 },
        { id: 'secondary_school', label: 'Secondary School', maxSelections: 3 },
        { id: 'university', label: 'University', maxSelections: 3 }
      ]
    },
    {
      id: 'entertainment',
      label: 'Entertainment & Recreation',
      icon: Trees,
      color: 'bg-green-100 text-green-800',
      maxSelections: 20,
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
      subtypes: [
        { id: 'supermarket', label: 'Supermarket', maxSelections: 4 },
        { id: 'shopping_mall', label: 'Shopping Mall', maxSelections: 3 }
      ]
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Dumbbell,
      color: 'bg-purple-100 text-purple-800',
      subtypes: [
        { id: 'arena', label: 'Arena', maxSelections: 2 },
        { id: 'fitness_center', label: 'Fitness Center', maxSelections: 2 },
        { id: 'golf_course', label: 'Golf Course', maxSelections: 2 },
        { id: 'gym', label: 'Gym', maxSelections: 2 },
        { id: 'sports_complex', label: 'Sports Complex', maxSelections: 2 },
        { id: 'stadium', label: 'Stadium', maxSelections: 2 },
        { id: 'swimming_pool', label: 'Swimming Pool', maxSelections: 2 }
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

  // Group places by category
  const groupPlacesByCategory = (places: any[]) => {
    const grouped: Record<string, any[]> = {};
    
    places.forEach(place => {
      // Try to categorize by type first
      let categoryId = place.type;
      
      // Check if the place type is a subtype, find its parent category
      const parentCategory = findCategoryByType(place.type);
      if (parentCategory) {
        categoryId = parentCategory.id;
      }
      
      // If we still don't have a category, check if any of the place's types
      // match any of our category or subtype ids
      if (!grouped[categoryId] && place.types && Array.isArray(place.types)) {
        for (const type of place.types) {
          const typeCategory = findCategoryByType(type);
          if (typeCategory) {
            categoryId = typeCategory.id;
            break;
          }
        }
      }
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      
      grouped[categoryId].push(place);
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
