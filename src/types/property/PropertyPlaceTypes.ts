export type PropertyPlaceType = 'restaurant' | 'school' | 'park' | 'shop' | 'hospital' | 'transit' | 'other';

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number;
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  type: PropertyPlaceType | string;
  types?: string[];
  visible_in_webview?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  category?: string; // Added category property
}
