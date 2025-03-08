
import { PropertyArea } from "./PropertyAreaTypes";
import { PropertyFeature } from "./PropertyFeatureTypes";
import { PropertyNearbyPlace, PropertyCity } from "./PropertyLocationTypes";
import { PropertyTechnicalItem } from "./PropertyTechnicalTypes";
import { PropertyAgent } from "./PropertyAgentTypes";

export interface PropertyData {
  id: string;
  object_id?: string;
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
  location_description: string;
  features: PropertyFeature[];
  featuredImage: string | null;
  featuredImages: string[];
  images: any[];
  areas: PropertyArea[];
  map_image: string | null;
  nearby_places: PropertyNearbyPlace[];
  latitude: number | null;
  longitude: number | null;
  template_id: string;
  floorplans: any[];
  virtualTourUrl: string;
  youtubeUrl: string;
  technicalItems: PropertyTechnicalItem[];
  agent?: PropertyAgent | null;
  
  // Additional required properties
  floorplanEmbedScript?: string;
  nearby_cities?: PropertyCity[];
  areaPhotos?: any[];
  // For backward compatibility
  coverImages?: string[];
  gridImages?: string[];
}

export interface PropertyFormData extends Omit<PropertyData, 'id'> {
  id?: string;
  agent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertySubmitData extends Omit<PropertyFormData, 'images' | 'featuredImage' | 'featuredImages'> {
  images?: string[];
  featuredImage?: string | null;
  featuredImages?: string[];
  technicalItems?: any; // Make sure technicalItems is included here
  floorplanEmbedScript?: string;
}
