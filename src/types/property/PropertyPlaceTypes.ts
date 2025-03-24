
export type PropertyPlaceType = 'restaurant' | 'school' | 'park' | 'shop' | 'hospital' | 'transit' | 'other';

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number;
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  type: PropertyPlaceType | string;
  propertyTypes?: string[]; // Array of place types
  visible_in_webview?: boolean;
  latitude?: number;
  longitude?: number;
  category?: string; // Added category field
}
