
import { PropertyNearbyPlace } from "@/types/property";
import { Coffee, GraduationCap, ShoppingCart, ShoppingBag, Dumbbell, Film } from "lucide-react";

export type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

export function useCategories() {
  // Define standard categories for nearby places with icons and colors
  const categories: Category[] = [
    { 
      id: "restaurant", 
      label: "Restaurants", 
      icon: <Coffee className="h-4 w-4" />,
      color: "bg-red-100 text-red-800" 
    },
    { 
      id: "education", 
      label: "Education", 
      icon: <GraduationCap className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800" 
    },
    { 
      id: "supermarket", 
      label: "Supermarkets", 
      icon: <ShoppingCart className="h-4 w-4" />,
      color: "bg-orange-100 text-orange-800" 
    },
    { 
      id: "shopping", 
      label: "Shopping", 
      icon: <ShoppingBag className="h-4 w-4" />,
      color: "bg-yellow-100 text-yellow-800" 
    },
    { 
      id: "sport", 
      label: "Sport Facilities", 
      icon: <Dumbbell className="h-4 w-4" />,
      color: "bg-emerald-100 text-emerald-800" 
    },
    { 
      id: "leisure", 
      label: "Leisure", 
      icon: <Film className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-800" 
    }
  ];
  
  // Group places by category
  const groupPlacesByCategory = (nearbyPlaces: PropertyNearbyPlace[]) => {
    const placesByCategory: Record<string, PropertyNearbyPlace[]> = {
      all: [...nearbyPlaces]
    };
    
    nearbyPlaces.forEach((place) => {
      const category = determinePlaceCategory(place);
      if (!placesByCategory[category]) {
        placesByCategory[category] = [];
      }
      placesByCategory[category].push(place);
    });
    
    return placesByCategory;
  };
  
  // Function to determine the category of a place based on its type
  const determinePlaceCategory = (place: PropertyNearbyPlace): string => {
    const placeType = place.type?.toLowerCase() || '';
    
    if (placeType.includes('restaurant') || placeType.includes('cafe') || placeType.includes('food') || placeType.includes('bar')) {
      return 'restaurant';
    } else if (placeType.includes('school') || placeType.includes('university') || placeType.includes('education')) {
      return 'education';
    } else if (placeType.includes('supermarket') || placeType.includes('grocery')) {
      return 'supermarket';
    } else if (placeType.includes('shop') || placeType.includes('mall') || placeType.includes('store')) {
      return 'shopping';
    } else if (placeType.includes('gym') || placeType.includes('sport') || placeType.includes('fitness')) {
      return 'sport';
    } else if (placeType.includes('park') || placeType.includes('entertainment') || placeType.includes('leisure') || placeType.includes('theater')) {
      return 'leisure';
    }
    
    return placeType || 'other';
  };
  
  // Get category color based on place type
  const getCategoryColor = (placeType: string): string => {
    const category = categories.find(cat => cat.id === determinePlaceCategory({ type: placeType } as PropertyNearbyPlace));
    return category?.color || "bg-gray-100 text-gray-800";
  };
  
  // Get category icon based on place type
  const getCategoryIcon = (placeType: string) => {
    const category = categories.find(cat => cat.id === determinePlaceCategory({ type: placeType } as PropertyNearbyPlace));
    return category?.icon || null;
  };
  
  // Get readable category name
  const getCategoryLabel = (placeType: string): string => {
    const category = categories.find(cat => cat.id === determinePlaceCategory({ type: placeType } as PropertyNearbyPlace));
    return category?.label || placeType.charAt(0).toUpperCase() + placeType.slice(1);
  };
  
  return {
    categories,
    groupPlacesByCategory,
    determinePlaceCategory,
    getCategoryColor,
    getCategoryIcon,
    getCategoryLabel
  };
}
