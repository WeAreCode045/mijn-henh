
import { PropertyArea } from './PropertyAreaTypes';
import { PropertyFeature } from './PropertyFeatureTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyNearbyPlace, PropertyCity } from './PropertyLocationTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';
import { PropertyTechnicalItem } from './PropertyTechnicalTypes';
import { PropertyAgent } from './PropertyAgentTypes';
import { PropertyBase } from './PropertyBaseTypes';

export interface PropertyFormData extends PropertyBase {
  features: PropertyFeature[];
  areas: PropertyArea[];
  nearby_places: PropertyNearbyPlace[];
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  images: (string | { url: string })[];
  featuredImage: string | null;
  featuredImages: string[];
  floorplans?: PropertyFloorplan[];
  technicalItems?: PropertyTechnicalItem[];
  // Add missing fields that are being used
  areaPhotos?: string[];
  nearby_cities?: PropertyCity[];
  coverImages?: string[]; // For backward compatibility
  gridImages?: string[]; // For backward compatibility
}

export interface PropertyData extends PropertyBase {
  id: string;
  features: PropertyFeature[];
  areas: PropertyArea[];
  nearby_places: PropertyNearbyPlace[];
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  images: (string | { url: string })[];
  featuredImage: string | null;
  featuredImages: string[];
  floorplans?: PropertyFloorplan[];
  agent?: PropertyAgent;
  technicalItems?: PropertyTechnicalItem[];
  // Add missing fields
  areaPhotos?: string[];
  nearby_cities?: PropertyCity[];
  coverImages?: string[]; // For backward compatibility
  gridImages?: string[]; // For backward compatibility
}

export interface PropertySubmitData extends PropertyBase {
  features: any;
  areas: PropertyArea[];
  nearby_places: any;
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  images: string[];
  featuredImage: string | null;
  featuredImages: string[];
  floorplans?: any[];
  technicalItems?: any;
  // Add missing fields
  areaPhotos?: string[];
  nearby_cities?: PropertyCity[];
}
