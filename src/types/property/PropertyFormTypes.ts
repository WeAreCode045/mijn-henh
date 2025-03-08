
import { PropertyArea } from './PropertyAreaTypes';
import { PropertyFeature } from './PropertyFeatureTypes';
import { PropertyNearbyPlace } from './PropertyPlaceTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';
import { PropertyCity } from './PropertyCityTypes';
import { PropertyTechnicalItem } from './PropertyTechnicalItemTypes';

/**
 * Represents form data for property submission
 */
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
  location_description: string;
  features: PropertyFeature[];
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  coverImages?: string[]; // For backward compatibility
  gridImages?: string[]; // For backward compatibility
  areas: PropertyArea[];
  nearby_places: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  agent_id?: string;
  object_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplans?: PropertyFloorplan[];
  floorplanEmbedScript?: string;
  technicalItems?: PropertyTechnicalItem[];
  areaPhotos?: string[];
}

/**
 * Represents data for property submission to the database
 * Excluding client-side specific fields like imagesFiles
 */
export interface PropertySubmitData extends Omit<PropertyFormData, "featuredImage" | "featuredImages" | "images"> {
  images: string[];
  technicalItems?: any; // JSON compatible
  floorplanEmbedScript?: string;
}
