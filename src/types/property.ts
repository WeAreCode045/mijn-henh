import { Json } from "@/integrations/supabase/types";

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null; // Added area property for storing area assignment
  property_id?: string;
  created_at?: string;
  type?: string;
  is_main?: boolean; // Updated from is_featured to is_main
  is_featured_image?: boolean; // Updated from is_grid_image to is_featured_image
  [key: string]: string | boolean | null | undefined; // Updated index signature to include boolean
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  imageIds: string[];
  columns?: number; // Field for grid column count
}

export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
  columns?: number; // Added columns property for grid layout
}

export interface PropertyFloorplan {
  id?: string;     // Added ID property for tracking floorplans
  url: string;
  filePath?: string; // Added filePath for storage deletion
  columns?: number; // Field for grid column count
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
  caption?: string;
  sortOrder?: number;
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
  technicalItems?: PropertyTechnicalItem[]; // New field for technical items
  featuredImage: string | null;
  featuredImages: string[]; // Changed from coverImages to featuredImages
  coverImages?: string[]; // Keep for backward compatibility 
  gridImages?: string[]; // Keep for backward compatibility
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
  template_id?: string; // Added template_id property
  floorplanEmbedScript?: string; // Added floorplanEmbedScript property
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
  technicalItems?: Json; // New field for technical items
  featuredImage: string | null;
  featuredImages: string[]; // Changed from coverImages to featuredImages
  coverImages?: string[]; // Keep for backward compatibility
  gridImages?: string[]; // Keep for backward compatibility
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
  template_id?: string; // Added template_id property
  floorplanEmbedScript?: string; // Added floorplanEmbedScript property
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
  features?: Json;
  floorplans?: Json;
  featuredImage?: string | null;
  featuredImages?: string[]; // Changed from coverImages to featuredImages
  coverImages?: string[]; // Keep for backward compatibility
  gridImages?: string[]; // Keep for backward compatibility
  areas?: Json[];
  areaPhotos?: string[];
  object_id?: string;
  map_image?: string | null;
  nearby_places?: Json;
  latitude?: number | null;
  longitude?: number | null;
  agent_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
  floorplanEmbedScript?: string; // Added floorplanEmbedScript property
}
