
export type PropertyPlaceType = 'restaurant' | 'school' | 'park' | 'shop' | 'hospital' | 'transit' | 'other';

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number;
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  type: PropertyPlaceType | string;
  propertyTypes?: string[]; // Renamed from 'types' to 'propertyTypes' to avoid conflicts
  visible_in_webview?: boolean;
  latitude?: number;
  longitude?: number;
  category?: string; // Category field to track which category a place belongs to
}
