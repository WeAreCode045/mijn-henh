
// Property place type
export interface PropertyPlaceType {
  id: string;
  place_id?: string; // Adding this to fix the type error
  name: string;
  vicinity?: string;
  type: string;
  types?: string[];
  distance?: number;
  visible_in_webview?: boolean;
}

// Nearby place type (alternative interface for backward compatibility)
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  type: string;
  address?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
}
