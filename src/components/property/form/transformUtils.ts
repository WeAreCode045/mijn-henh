
import { PropertyPlaceType, PropertyNearbyPlace } from "@/types/property";

export function transformPropertyNearbyPlaces(placesData: any[]): PropertyNearbyPlace[] {
  return placesData.map(place => ({
    id: place.id || "",
    name: place.name || "",
    type: place.type || "other",
    types: place.types || [place.type || "other"], // Ensure types exists
    vicinity: place.vicinity || "",
    rating: place.rating || 0,
    user_ratings_total: place.user_ratings_total || 0,
    visible_in_webview: place.visible_in_webview || false,
    distance: place.distance || 0
  }));
}
