
export interface PropertyPlaceType {
  id: string;
  name: string;
  icon?: string;
  type?: string;
  category?: string;
  [key: string]: unknown;
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number; // Making distance required to match property.d.ts
  type: string; // Making type required
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  latitude?: number | null;
  longitude?: number | null;
  visible_in_webview?: boolean;
  icon?: string;
  category?: string;
  [key: string]: unknown;
}
