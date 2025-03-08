
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  description?: string;
  // Add missing properties that are being referenced
  type: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
}

export interface PropertyCity {
  name: string;
  distance: number;
  visible_in_webview?: boolean;
}
