
/**
 * Property data related type definitions
 */

import { PropertyArea } from "./PropertyAreaTypes";
import { PropertyFeature } from "./PropertyFeatureTypes";
import { PropertyAgent } from "./PropertyAgentTypes";
import { PropertyNearbyPlace, PropertyCity } from "./PropertyLocationTypes";
import { PropertyTechnicalItem } from "./PropertyTechnicalTypes";
import { PropertyImage, PropertyImageUnion } from "./PropertyImageTypes";

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
  location_description: string;
  features: PropertyFeature[];
  areas: PropertyArea[];
  images: PropertyImageUnion[];
  nearby_places: PropertyNearbyPlace[];
  agent_id?: string;
  agent?: PropertyAgent;
  latitude?: number | null;
  longitude?: number | null;
  map_image?: string | null;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
  object_id?: string;
  floorplans?: PropertyImageUnion[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  featuredImage?: string | null;
  featuredImages?: string[];
  technicalItems?: PropertyTechnicalItem[];
  // Additional properties needed by components
  coverImages?: string[];
  gridImages?: string[];
  floorplanEmbedScript?: string;
  nearby_cities?: PropertyCity[];
}

export interface PropertyFormData extends Omit<PropertyData, 'id'> {
  id?: string;
  // Add any form-specific fields
  areaPhotos?: string[];
}

export interface PropertySubmitData extends Omit<PropertyFormData, "featuredImage" | "featuredImages" | "images"> {
  images: string[];
  technicalItems?: PropertyTechnicalItem[];
  floorplanEmbedScript?: string;
  coverImages?: string[];
}
