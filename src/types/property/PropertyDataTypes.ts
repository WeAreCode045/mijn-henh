
import { PropertyFeature } from './PropertyTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyNearbyPlace, PropertyCity } from './PropertyLocationTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';

export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  title: string; // Added based on the error messages
  description: string;
  images: string[] | { url: string }[];
  imageIds: string[]; // Added based on the error messages
  columns: number; // Added based on the error messages
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
  features: any;
  images: string[];
  areas: any[];
  map_image?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: any;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: string[];
  featuredImage?: string | null;
  featuredImages?: string[];
  technicalItems?: any; // Added based on the error messages
  floorplanEmbedScript?: string; // Added based on the error messages
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
  images: (string | { url: string })[];
  areas: PropertyArea[];
  map_image?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[]; // Added based on the error messages
  object_id?: string;
  agent_id?: string;
  agent?: any; // Added based on the error messages
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: (string | { url: string })[];
  featuredImage?: string | null;
  featuredImages?: string[];
  technicalItems?: PropertyTechnicalItem[];
  floorplanEmbedScript?: string; // Added based on the error messages
  coverImages?: string[]; // Added based on the error messages
  gridImages?: any[]; // Added based on the error messages
}

export interface PropertyFormData extends PropertyData {
  areaPhotos?: string[]; // Added based on the error messages
}
