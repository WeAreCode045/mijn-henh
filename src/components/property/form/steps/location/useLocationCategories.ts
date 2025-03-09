
import { useState, useMemo } from 'react';
import { PropertyNearbyPlace } from '@/types/property';

interface CategoryWithCount {
  name: string;
  count: number;
}

export function useLocationCategories(nearbyPlaces: PropertyNearbyPlace[]) {
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'education', 'sports', 'transportation', 'shopping', 'restaurant', 'health', 'other'
  ]);
  
  // Generate categories from nearby places
  const categories = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    
    nearbyPlaces.forEach(place => {
      const category = place.type || 'other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));
  }, [nearbyPlaces]);
  
  const handleFilterChange = (category: string) => {
    setActiveFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  return {
    categories,
    activeFilters,
    handleFilterChange
  };
}
