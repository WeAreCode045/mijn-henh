
import { Json } from "@/integrations/supabase/types";

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  [key: string]: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  imageIds: string[];
  columns?: number; // Field for grid column count
}

export interface PropertyFloorplan {
  url: string;
  columns?: number; // New field for grid column count
}

export interface PropertyPlaceType {
  id: string;
  name: string;
  type: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

export interface PropertyGridImage {
  id: string;
  url: string;
}

// Agent interface for property
export interface PropertyAgent {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
}

// Base interface with common properties
interface BasePropertyData {
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
  location_description?: string;
  features: PropertyFeature[];
  images: PropertyImage[];
  floorplans: PropertyFloorplan[]; // Updated to structured objects
  featuredImage: string | null;
  gridImages: string[];
  areas: PropertyArea[];
  areaPhotos?: string[];
  currentPath?: string;
  object_id?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  latitude?: number | null;
  longitude?: number | null;
  agent_id?: string;
  agent?: PropertyAgent;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// PropertyData requires id
export interface PropertyData extends BasePropertyData {
  id: string;
}

// PropertyFormData makes id optional
export interface PropertyFormData extends BasePropertyData {
  id?: string;
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
  location_description?: string;
  floorplans: Json; // Updated to Json for structured floorplans
  featuredImage: string | null;
  gridImages: string[];
  areaPhotos?: string[];
  object_id?: string;
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features: Json;
  areas: Json[];
  nearby_places: Json;
  images: string[];
  agent_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
}

export interface PropertyDatabaseData {
  id?: string;
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
  location_description?: string;
  floorplans?: Json; // Updated to Json for structured floorplans
  featuredImage?: string | null;
  gridImages?: string[];
  areaPhotos?: string[];
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features?: Json;
  areas?: Json[];
  nearby_places?: Json;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
}
