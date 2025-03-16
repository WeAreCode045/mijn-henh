
import { Area } from './area';

// Type for property features
export interface PropertyFeature {
  id: string;
  description: string;
}

// Image type definition aligned with property_images table
export interface PropertyImage {
  id: string;
  url: string;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  type?: 'image' | 'floorplan' | string;
  area?: string | null;
  sort_order?: number;
  filePath?: string;
  title?: string;
  description?: string;
  columns?: number;
}

// Define PropertyFloorplan as an alias to PropertyImage for compatibility
export type PropertyFloorplan = PropertyImage & {
  title?: string;
  description?: string;
  is_featured?: boolean;
  timestamp?: string;
};

// Property area with all required fields
export interface PropertyArea {
  id: string;
  name?: string;
  size?: string;
  title: string;
  description: string;
  images: (PropertyImage | string)[]; 
  imageIds?: string[];
  columns?: number;
}

// Property nearby place
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance?: string | number;
  type?: string;
  types?: string[];
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
}

// Define PropertyPlaceType as PropertyNearbyPlace 
export type PropertyPlaceType = PropertyNearbyPlace;

// City type
export interface PropertyCity {
  id: string;
  name: string;
  distance?: string | number;
  visible_in_webview?: boolean;
  description?: string;
  image?: string;
}

// Property agent
export interface PropertyAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
}

// New type for structured General Info
export interface GeneralInfoData {
  propertyDetails: {
    title: string;
    price: string;
    address: string;
    objectId: string;
  };
  description: {
    shortDescription: string;
    fullDescription: string;
  };
  keyInformation: {
    buildYear: string;
    lotSize: string;
    livingArea: string;
    bedrooms: string;
    bathrooms: string;
    energyClass: string;
  };
}

// Property data interface
export interface PropertyData {
  id: string;
  title: string; // Required field
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
  images?: (PropertyImage | string)[];
  areas?: PropertyArea[];
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  nearby_places?: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  object_id?: string;
  agent_id?: string;
  agent?: PropertyAgent;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: (PropertyImage | string)[];
  floorplanEmbedScript?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  created_at?: string;
  updated_at?: string;
  coverImages?: (PropertyImage | string)[];
  gridImages?: (PropertyImage | string)[];
  areaPhotos?: (PropertyImage | string)[];
  generalInfo?: GeneralInfoData;
}

// Property form data
export interface PropertyFormData extends Partial<PropertyData> {
  id: string;
  title?: string; // Make this optional for form data
  areaPhotos?: (PropertyImage | string)[];
  coverImages?: (PropertyImage | string)[];
  gridImages?: (PropertyImage | string)[];
  generalInfo?: GeneralInfoData;
  created_at?: string;
  updated_at?: string;
}

// Property submit data
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
  images: string[];
  areas: any;
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  nearby_places?: string;
  nearby_cities?: string;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: string[];
  featuredImage?: string | null;
  featuredImages?: string[];
  floorplanEmbedScript?: string;
  generalInfo?: string;
}
