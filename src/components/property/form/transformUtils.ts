
import type { PropertyPlaceType } from "@/types/property";
import type { Json } from "@/integrations/supabase/types";

export const transformNearbyPlaces = (places: Json | null): PropertyPlaceType[] => {
  if (!places || !Array.isArray(places)) return [];
  
  return places.map(place => {
    if (typeof place === 'object' && place !== null && !Array.isArray(place)) {
      return {
        id: String(place.id || ''),
        name: String(place.name || ''),
        type: String(place.type || ''),
        vicinity: String(place.vicinity || ''),
        rating: Number(place.rating || 0),
        user_ratings_total: Number(place.user_ratings_total || 0)
      };
    }
    return {
      id: '',
      name: '',
      type: '',
      vicinity: '',
      rating: 0,
      user_ratings_total: 0
    };
  });
};
