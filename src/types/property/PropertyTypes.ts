
import { PropertyImage } from './PropertyImageTypes';
import { PropertyArea } from './PropertyAreaTypes';

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  alt?: string;
  description?: string;
  filePath?: string;
  sort_order?: number;
  property_id?: string;
  is_featured?: boolean;
  timestamp?: string;
  type: "floorplan";
  columns?: number;
}

export interface PropertyPlaceType {
  id: string;
  place_id: string; // Required field
  name: string;
  type?: string;
  types?: string[]; 
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
  distance?: number;
}

// Alias for backward compatibility
export type PropertyNearbyPlace = PropertyPlaceType;

export interface PropertyCity {
  id: string;
  name: string;
  distance?: number;
  visible_in_webview?: boolean;
  duration?: number;
  description?: string;
  image?: string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  address?: string;
}

export interface GeneralInfoData {
  propertyDetails?: Record<string, any>;
  description?: Record<string, any>;
  keyInformation?: Record<string, any>;
  [key: string]: any;
}

export interface PropertySubmitData {
  id: string;
  title: string;
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
  features?: PropertyFeature[] | string;
  nearby_places?: PropertyPlaceType[] | string;
  nearby_cities?: PropertyCity[] | string;
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  propertyType?: string;
  generalInfo?: GeneralInfoData | string;
}
