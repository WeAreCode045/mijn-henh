
import { PropertyNearbyPlace } from "@/types/property";

// Define the PlaceOption type to be compatible with PropertyNearbyPlace
export interface PlaceOption {
  id: string;
  name: string;
  distance?: string | number; // Make distance optional to match how it's used
  vicinity?: string;
  rating?: number | null;
  user_ratings_total?: number;
  type: string;
  types?: string[];
  visible_in_webview?: boolean;
  latitude?: number;
  longitude?: number;
}

// You can add any other exports or functions needed for this file
