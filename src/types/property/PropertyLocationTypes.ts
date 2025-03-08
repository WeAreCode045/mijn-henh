
export enum PropertyPlaceType {
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  STORE = 'store',
  SCHOOL = 'school',
  PARK = 'park',
  HOSPITAL = 'hospital',
  GYM = 'gym',
  BANK = 'bank',
  PHARMACY = 'pharmacy',
  BAR = 'bar',
  SUPERMARKET = 'supermarket',
  TRANSPORTATION = 'transit_station'
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  type?: string; // Added based on the error messages
  visible_in_webview?: boolean; // Added based on the error messages
}

export interface PropertyCity {
  id?: string;
  name: string;
  distance: number;
  visible_in_webview?: boolean;
}
