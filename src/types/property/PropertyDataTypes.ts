
import { PropertyArea, PropertyTechnicalItem } from './PropertyTypes';
import { PropertyNearbyPlace } from './PropertyPlaceTypes';
import { PropertyCity } from './PropertyCityTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';

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
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
  };
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: PropertyFloorplan[] | string[] | { url: string }[];
  featuredImage?: string | null;
  featuredImages?: string[];
  coverImages?: string[];
  gridImages?: string[];
  technicalItems?: PropertyTechnicalItem[];
  areaPhotos?: string[];
  floorplanEmbedScript?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyFormData extends PropertyData {
  // Additional properties specific to form state
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
  technicalItems?: string;
  floorplanEmbedScript?: string;
}
