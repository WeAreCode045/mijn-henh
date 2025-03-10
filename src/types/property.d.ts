export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  description: string;
  images: string[] | { url: string }[];
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance: string;
}

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
  map_image?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: string;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: string[];
  featuredImage?: string | null;
  featuredImages?: string[];
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
  location_description?: string;
  features: PropertyFeature[];
  images: string[] | { url: string }[];
  areas: PropertyArea[];
  map_image?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: PropertyNearbyPlace[];
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: string[] | { url: string }[];
  featuredImage?: string | null;
  featuredImages?: string[];
}

export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
}

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
  location_description?: string;
  features: PropertyFeature[];
  images: string[] | { url: string }[];
  areas: PropertyArea[];
  map_image?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: PropertyNearbyPlace[];
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: string[] | { url: string }[];
  technicalItems?: PropertyTechnicalItem[];
  featuredImage?: string | null;
  featuredImages?: string[];
}
