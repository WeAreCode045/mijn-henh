
import { PropertyData } from "./PropertyDataTypes";
import { PropertyImage } from "./PropertyImageTypes";
import { PropertyArea } from "./PropertyAreaTypes";

// Basic data types
export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  sort_order?: number;
  filePath?: string; // Used during upload process
  columns?: number; // Used for layout
  description?: string;
  type?: "floorplan";
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  place_id: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  type: string;
  types: string[];
  visible_in_webview?: boolean;
  distance: number | string;
}

export interface PropertyCity {
  id: string;
  name: string;
  distance?: string | number;
  visible_in_webview?: boolean;
}

// Agent type
export interface PropertyAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
}

// GeneralInfoData type
export interface GeneralInfoData {
  propertyDetails?: {
    title: string;
    price: string;
    address: string;
    objectId: string;
  };
  description?: {
    shortDescription: string;
    fullDescription: string;
  };
  keyInformation?: {
    buildYear: string;
    lotSize: string;
    livingArea: string;
    bedrooms: string;
    bathrooms: string;
    energyClass: string;
    garages?: string;
    hasGarden?: boolean;
  };
  [key: string]: any;
}

// Export PropertyPlaceType as the interface itself
export type PropertyPlaceType = PropertyNearbyPlace;

// Export for backward compatibility
export { PropertyArea };

// Composite types for forms
export interface PropertySubmitData {
  id?: string;
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  description: string;
  shortDescription?: string;
  location_description?: string;
  features: string;
  areas: any;
  nearby_places?: string;
  nearby_cities?: string;
  latitude?: number | null;
  longitude?: number | null;
  map_image?: string | null;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  propertyType?: string;
  images?: string[];
  floorplans?: string[];
  floorplanEmbedScript?: string;
  generalInfo?: string | GeneralInfoData;
}
