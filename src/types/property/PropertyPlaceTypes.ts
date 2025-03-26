
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
  distance?: string | number;
  category?: string;
  type?: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  latitude?: number | null;
  longitude?: number | null;
  visible_in_webview?: boolean;
  icon?: string;
  [key: string]: unknown;
}
