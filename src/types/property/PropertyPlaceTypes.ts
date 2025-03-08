
/**
 * Represents the type of a nearby place
 */
export type PropertyPlaceType = 
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'supermarket'
  | 'school'
  | 'park'
  | 'gym'
  | 'hospital'
  | 'pharmacy'
  | 'bus_station'
  | 'subway_station'
  | 'train_station'
  | 'shopping_mall'
  | 'airport'
  | 'tourist_attraction'
  | 'other';

/**
 * Represents a nearby place to a property
 */
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  type: PropertyPlaceType;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  distance: number;
  visible_in_webview?: boolean;
}
