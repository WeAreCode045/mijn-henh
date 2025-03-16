
import type { Area, AreaImage } from "./area";
import { Json } from "@/integrations/supabase/types";

export interface PropertyImage {
  id: string;
  url: string;
  type?: 'image' | 'floorplan';
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  area?: string;
  title?: string;
  description?: string;
  filePath?: string;
}

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  images?: PropertyImage[] | (string | PropertyImage)[];
  imageIds?: string[];
  columns?: number;
  name?: string;
  size?: string;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  sort_order?: number;
  filePath?: string;
  columns?: number;
  description?: string;
}

export interface PropertyCity {
  id: string;
  name: string;
  distance: number;
  duration?: number;
  visible_in_webview?: boolean;
}

export interface PropertyPlaceType {
  id: string;
  name: string;
  google_place_id?: string;
  icon?: string;
  photos?: string[];
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  types: string[];
  type?: string; // Adding this for backward compatibility
  location?: {
    lat: number;
    lng: number;
  };
  visible_in_webview?: boolean;
  distance?: number | string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
}

export interface PropertyData {
  id: string;
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
  areas: PropertyArea[];
  nearby_places: PropertyPlaceType[];
  nearby_cities: PropertyCity[];
  images: PropertyImage[];
  floorplans: PropertyImage[] | PropertyFloorplan[];
  map_image: string | null;
  latitude: number | null;
  longitude: number | null;
  object_id: string;
  agent_id: string;
  agent?: PropertyAgent;
  template_id: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  notes?: string;
  featuredImage: string | null;
  featuredImages: string[];
  floorplanEmbedScript: string;
  created_at: string;
  updated_at: string;
  coverImages: PropertyImage[];
  gridImages: PropertyImage[];
  generalInfo?: GeneralInfoData;
  shortDescription?: string;
}

// Define PropertyNearbyPlace as an alias of PropertyPlaceType for backward compatibility
export type PropertyNearbyPlace = PropertyPlaceType;

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
  location_description: string;
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

export interface PropertyFormData {
  id: string;
  title?: string;
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
  areas?: PropertyArea[];
  nearby_places?: PropertyPlaceType[];
  nearby_cities?: PropertyCity[];
  images?: (string | PropertyImage)[];
  floorplans?: (string | PropertyImage | PropertyFloorplan)[];
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  agent?: PropertyAgent;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  floorplanEmbedScript?: string;
  // New field to store structured General Info
  generalInfo?: GeneralInfoData;
  // Backward compatibility fields
  created_at?: string;
  updated_at?: string;
  coverImages?: PropertyImage[];
  gridImages?: PropertyImage[];
  areaPhotos?: string[];
}

// New type for structured General Info
export interface GeneralInfoData {
  propertyDetails?: {
    title?: string;
    price?: string;
    address?: string;
    objectId?: string;
  };
  description?: {
    shortDescription?: string;
    fullDescription?: string;
  };
  keyInformation?: {
    buildYear?: string;
    lotSize?: string;
    livingArea?: string;
    bedrooms?: string;
    bathrooms?: string;
    energyClass?: string;
  };
}
