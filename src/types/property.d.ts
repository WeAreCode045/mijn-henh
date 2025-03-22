
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
  type?: string;
  area?: string | null;
  sort_order?: number;
  filePath?: string;
  title?: string;
  description?: string;
  columns?: number; // Added for FloorplanProcessor compatibility
}

// Define PropertyFloorplan as an alias to PropertyImage for compatibility
export type PropertyFloorplan = PropertyImage;

// Property area with all required fields
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  title: string;
  description: string;
  images: PropertyImage[]; 
  imageIds: string[]; // Adding this property to match PropertyAreaTypes.ts
  columns: number;
}

// Property nearby place
export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string | number;
  type: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
}

// Define PropertyPlaceType as PropertyNearbyPlace (not a union type)
export type PropertyPlaceType = PropertyNearbyPlace;

// City type
export interface PropertyCity {
  id: string;
  name: string;
  distance?: string | number;
  visible_in_webview?: boolean;
}

// Property agent
export interface PropertyAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
  full_name?: string;
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
  shortDescription?: string; // Added shortDescription field
  location_description?: string;
  features: PropertyFeature[];
  images: PropertyImage[];
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
  floorplans?: PropertyImage[];
  floorplanEmbedScript?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  created_at?: string;
  updated_at?: string;
  status?: string; // Added status property
  archived?: boolean; // Added archived property
  metadata?: {
    status?: string;
    [key: string]: any;
  }; // Add metadata property
  propertyType?: string; // Add propertyType property
  // For backward compatibility - can be PropertyImage[] or string[]
  coverImages?: PropertyImage[] | string[];
  gridImages?: PropertyImage[] | string[];
  areaPhotos?: PropertyImage[] | string[];
}

// Property form data extends PropertyData
export interface PropertyFormData extends PropertyData {
  // For backward compatibility in the form
  areaPhotos?: PropertyImage[] | string[];
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
  shortDescription?: string; // Added shortDescription field
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
  status?: string; // Added status property
  archived?: boolean; // Added archived property
  metadata?: {
    status?: string;
    [key: string]: any;
  }; // Add metadata property
  propertyType?: string; // Add propertyType property
}
