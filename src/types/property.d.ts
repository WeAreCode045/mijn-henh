
// Type for property features
export interface PropertyFeature {
  id: string;
  description: string;
}

// Image type definition
export interface PropertyImage {
  id: string;
  url: string;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  type?: string;
  area?: string | null;
  sort_order?: number;
  filePath?: string;
}

// Property area with all required fields
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  title: string;
  description: string;
  images: string[] | { url: string }[];
  imageIds: string[];
  columns: number;
}

// Place type enum
export type PropertyPlaceType = 'restaurant' | 'cafe' | 'shopping' | 'school' | 'transport' | 'park' | 'health' | 'entertainment' | 'other';

// Nearby place
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number;
  type: PropertyPlaceType;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
}

// City type
export interface PropertyCity {
  id: string;
  name: string;
  distance?: string | number;
  visible_in_webview?: boolean;
}

// Floor plan type
export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  description?: string;
  property_id?: string;
  sort_order?: number;
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

// Property data interface
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
  location_description?: string;
  features: PropertyFeature[];
  images: PropertyImage[] | string[] | { url: string }[];
  areas: PropertyArea[];
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
  floorplans?: PropertyFloorplan[] | string[] | { url: string }[];
  floorplanEmbedScript?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  coverImages?: string[];
  gridImages?: string[];
  areaPhotos?: string[];
  created_at?: string;
  updated_at?: string;
}

// Property form data extends PropertyData
export interface PropertyFormData extends PropertyData {
  areaPhotos?: string[];
  coverImages?: string[];
  gridImages?: string[];
  nearby_cities?: PropertyCity[];
}

// Property submit data
export interface PropertySubmitData {
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
  features: string;
  images: string[];
  areas: PropertyArea[];
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
}
