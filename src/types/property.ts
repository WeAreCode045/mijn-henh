
// Property place type
export interface PropertyPlaceType {
  id: string;
  place_id: string; // Making this required since it's used in several places
  name: string;
  vicinity?: string;
  type: string;
  types?: string[];
  distance?: number;
  visible_in_webview?: boolean;
  rating?: number;
  user_ratings_total?: number;
}

// Main property data interface
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
  shortDescription?: string;
  location_description: string;
  features?: PropertyFeature[];
  images?: PropertyImage[];
  featuredImage: string | null;
  featuredImages: PropertyImage[];
  areas?: PropertyArea[];
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  nearby_cities?: PropertyCity[];
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  agent?: PropertyAgent | null;
  template_id?: string;
  floorplans?: PropertyFloorplan[];
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  generalInfo?: PropertyGeneralInfo;
  propertyType?: string;
  created_at?: string;
  updated_at?: string;
  coverImages?: PropertyImage[];
  gridImages?: PropertyImage[];
  areaPhotos?: string[];
}

// Form data extension
export interface PropertyFormData extends PropertyData {
  // Any additional form-specific fields
}

// Type for property data submitted to the database
export interface PropertySubmitData extends PropertyData {
  // Any additional fields needed for database submission
  propertyType: string; // Make propertyType required for submission
}

// Property feature type
export interface PropertyFeature {
  id: string;
  description: string;
}

// Property area type
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  unit?: string;
  title?: string;
  description?: string;
  images: PropertyImage[];
  imageIds?: string[];
  columns?: number;
}

// Property image type
export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  type?: "image" | "floorplan";
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  property_id?: string;
  area?: string | null;
  filePath?: string;
}

// Property floorplan type
export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  description?: string;
  filePath?: string;
  sort_order?: number;
  columns?: number;
  type: "floorplan";
  alt?: string;
  property_id?: string;
}

// Property agent type
export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  address?: string;
  whatsapp_number?: string;
}

// Property city type
export interface PropertyCity {
  id: string;
  name: string;
  distance?: number;
  visible_in_webview?: boolean;
}

// Property general info type
export interface PropertyGeneralInfo {
  propertyDetails?: Record<string, any>;
  description?: Record<string, any>;
  keyInformation?: Record<string, any>;
  yearBuilt?: number;
  lotSize?: string;
  parking?: string;
  heating?: string;
  cooling?: string;
  // Add more fields as needed
}

// Re-export for backwards compatibility
export type GeneralInfoData = PropertyGeneralInfo;
export type PropertyNearbyPlace = PropertyPlaceType;
