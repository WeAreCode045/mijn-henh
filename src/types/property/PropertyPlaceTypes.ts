
export interface PropertyPlaceType {
  id: string;
  name: string;
  distance: string | number;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  type: string;
  types?: string[];
  visible_in_webview?: boolean;
}

export interface PropertyNearbyPlace extends PropertyPlaceType {}
