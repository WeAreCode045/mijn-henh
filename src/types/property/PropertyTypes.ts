import { PropertyData } from "./PropertyDataTypes";
import { PropertyPlaceType } from './PropertyPlaceTypes';
import { AreaImage } from './PropertyAreaTypes';

// Basic data types
export interface PropertyFeature {
  id: string;
  description: string;
}

// Re-export AreaImage from PropertyAreaTypes
export type { AreaImage } from './PropertyAreaTypes';

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  name: string;
  size: string;
  columns: number;
  // New structure for area images
  areaImages?: AreaImage[];
  // Legacy fields maintained for backward compatibility
  imageIds?: string[];
  images?: string[] | any[];
}

// Explicitly export Area as an alias to PropertyArea
export type Area = PropertyArea;

export interface PropertyAgent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url: string;
  name?: string; // Added for compatibility
  photoUrl?: string; // For compatibility with PropertyAgent in property.d.ts
  avatar_url?: string;
  address?: string; // For compatibility with PropertyAgent in property.d.ts
}

export interface PropertyImage {
  id: string;
  url: string;
  sort_order?: number;
  is_main?: boolean;
  is_featured_image?: boolean;
  area?: string;
  property_id?: string;
  type?: string;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  sort_order?: number;
  filePath?: string; // Used during upload process
  columns?: number; // Used for layout
}

// Import PropertyNearbyPlace from PropertyPlaceTypes instead of redefining it
import { PropertyNearbyPlace } from './PropertyPlaceTypes';

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
  shortDescription: string; // Added shortDescription field
  location_description: string;
  features: PropertyFeature[];
  images: PropertyImage[] | string[] | { url: string }[];
  featuredImage: string | null;
  featuredImages: string[];
  areas: PropertyArea[];
  map_image: string | null;
  map_image_url?: string; // Added for compatibility
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
  status?: string; // Status property
  propertyType?: string; // Property type property
  archived?: boolean;
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
  status?: string; // Status property
  propertyType?: string; // Property type property
  metadata?: {
    status?: string;
    [key: string]: any;
  }; // Metadata property
}

// Export PropertyPlaceType as a type, not the interface
export type { PropertyPlaceType } from './PropertyPlaceTypes';
