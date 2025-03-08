
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  distance: number;
  
  // Additional properties required by components
  type: string;
  visible_in_webview?: boolean;
}

export interface PropertyCity {
  id: string;
  name: string;
  distance: number;
  population?: number;
  visible_in_webview?: boolean;
}
