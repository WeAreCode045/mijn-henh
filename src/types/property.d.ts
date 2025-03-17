// Area type definition (previously missing)
export interface Area {
  id: string;
  name?: string;
  size?: string;
  title?: string;
  description?: string;
  images?: string[] | { url: string; id: string; }[];
  imageIds?: string[];
  columns?: number;
}

// Basic property data types
export interface PropertyImage {
  id: string;
  url: string;
  type?: "image" | "floorplan" | string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  property_id?: string;
  area?: string | null;
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
  imageIds: string[];
  columns: number;
  name: string;
  size: string;
  images: PropertyImage[] | string[] | { url: string; id: string; }[];
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  description?: string;
  filePath?: string;
  sort_order?: number;
  property_id?: string;
  is_featured?: boolean;
  timestamp?: string;
  columns?: number;
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  type: string;
  types?: string[];
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
  distance?: number | string;
}

export type PropertyPlaceType = PropertyNearbyPlace;

export interface PropertyCity {
  id: string;
  name: string;
  distance?: number | string;
  duration?: number;
  description?: string;
  image?: string;
  visible_in_webview?: boolean;
}

export interface PropertyAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
}

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
  };
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
  features: PropertyFeature[];
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  areas: PropertyArea[];
  map_image: string | null;
  nearby_places: PropertyNearbyPlace[];
  nearby_cities: PropertyCity[];
  latitude: number | null;
  longitude: number | null;
  object_id: string;
  agent_id: string;
  agent?: PropertyAgent;
  template_id: string;
  floorplans: PropertyFloorplan[] | PropertyImage[];
  floorplanEmbedScript: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  coverImages: PropertyImage[];
  gridImages: PropertyImage[];
  generalInfo?: GeneralInfoData;
}

// Property form data extends PropertyData with optional fields
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
  template_id?: string;
  object_id?: string;
  agent_id?: string;
  agent?: PropertyAgent;
  features: PropertyFeature[];
  areas: PropertyArea[];
  images?: PropertyImage[] | string[];
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  nearby_cities?: PropertyCity[];
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplans?: PropertyImage[] | string[];
  floorplanEmbedScript?: string;
  notes?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  propertyType?: string;
  
  // Legacy fields for backward compatibility
  coverImages?: string[];
  gridImages?: string[];
  areaPhotos?: string[];
  
  // Structure for unified general info
  generalInfo?: GeneralInfoData;
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
  floorplanEmbedScript?: string;
  generalInfo?: string | GeneralInfoData;
}

export type AreaImage = PropertyImage | { url: string; id: string };
