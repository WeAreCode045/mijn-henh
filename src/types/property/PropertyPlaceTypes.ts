
// Property place type
export interface PropertyPlaceType {
  id: string;
  place_id: string; // Making this required since it's used in several places
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
