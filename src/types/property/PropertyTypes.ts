import { PropertyData } from "./PropertyDataTypes";
import { PropertyImage } from "./PropertyImageTypes";

// Basic data types
export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  imageIds: string[]; // Explicitly defined property
  columns: number;
  name: string;
  size: string;
  images: PropertyImage[];
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
  [key: string]: any;
}

// Export PropertyPlaceType as the interface itself
export type { PropertyPlaceType } from './PropertyPlaceTypes';

// Composite types for forms
export interface PropertyFormData {
  id: string;
  title: string;  // Make title required to match PropertyData
  price?: string;
  address?: string;
  bedrooms?: string;
  bathrooms?: string;
  sqft?: string;
  livingArea?: string;
  buildYear?: string;
  garages?: string;
  energyLabel?: string;
  hasGarden?: boolean;
  description?: string;
  shortDescription?: string;
  location_description?: string;
  features?: PropertyFeature[];
  images?: PropertyImage[];
  featuredImage?: string | null;
  featuredImages?: string[];
  areas?: PropertyArea[];
  map_image?: string | null;
  nearby_places?: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  agent?: any;
  template_id?: string;
  floorplans?: PropertyFloorplan[];
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  created_at?: string;
  updated_at?: string;
  generalInfo?: GeneralInfoData;
  // For backward compatibility
  coverImages?: PropertyImage[];
  gridImages?: PropertyImage[];
  areaPhotos?: string[];
}

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
  images?: string[];
  floorplans?: string[];
  floorplanEmbedScript?: string;
  generalInfo?: string | GeneralInfoData;
}
