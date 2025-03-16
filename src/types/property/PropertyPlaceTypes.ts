
export interface PropertyPlaceType {
  id: string;
  name: string;
  distance: string | number;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  type?: string; // Keep for backward compatibility
  types: string[]; // Make sure this is required
  visible_in_webview?: boolean;
}

export interface PropertyNearbyPlace extends PropertyPlaceType {}
