
/**
 * Property location related types
 */

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  distance: number;
  // Additional properties needed by components
  type: string;
  visible_in_webview: boolean;
}

export interface PropertyCity {
  id: string;
  name: string;
  distance: number;
  visible_in_webview: boolean;
}

export type PropertyPlaceType = 
  | 'restaurant'
  | 'school'
  | 'park'
  | 'supermarket'
  | 'gym'
  | 'hospital'
  | 'shopping_mall'
  | 'cafe';
