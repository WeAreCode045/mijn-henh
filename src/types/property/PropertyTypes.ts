
import { PropertyData } from "./PropertyDataTypes";

// Basic data types
export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  imageIds: string[];
  columns: number;
  name: string;
  size: string;
  images: string[];
}

export interface PropertyImage {
  id: string;
  url: string;
  sort_order?: number;
  is_main?: boolean;
  is_featured_image?: boolean;
  area?: string;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  sort_order?: number;
  filePath?: string; // Used during upload process
  columns?: number; // Used for layout
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  type: string;
  visible_in_webview?: boolean;
  distance?: number;
}

export interface PropertyCity {
  id: string;
  name: string;
  distance?: string;
}

// Composite types for forms
export interface PropertyFormData {
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
  location_description: string;
  features: PropertyFeature[];
  images: PropertyImage[] | string[] | { url: string }[];
  featuredImage: string | null;
  featuredImages: string[];
  areas: PropertyArea[];
  map_image: string | null;
  nearby_places: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  latitude: number | null;
  longitude: number | null;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  floorplans?: PropertyFloorplan[];
  floorplanEmbedScript: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  areaPhotos?: string[];
  coverImages?: string[];
  gridImages?: string[];
  created_at?: string;
  updated_at?: string;
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
  location_description: string;
  features: string;
  areas: any;
  nearby_places: string;
  nearby_cities?: string;
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  images: string[];
  floorplanEmbedScript: string;
}

// Export PropertyPlaceType as the interface itself (not a string union)
export type PropertyPlaceType = PropertyNearbyPlace;
