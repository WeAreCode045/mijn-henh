
export type PropertyPlaceType = 'restaurant' | 'school' | 'park' | 'shop' | 'hospital' | 'transit' | 'other';

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number | null;
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  type: PropertyPlaceType | string;
  propertyTypes?: string[]; // Array of place types
  visible_in_webview?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  category?: string; // Category field
}
