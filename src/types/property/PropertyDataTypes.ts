
import { PropertyArea } from './PropertyAreaTypes';
import { PropertyFeature } from './PropertyFeatureTypes';
import { PropertyNearbyPlace } from './PropertyPlaceTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';
import { PropertyCity } from './PropertyCityTypes';
import { PropertyTechnicalItem } from './PropertyTechnicalItemTypes';

/**
 * Represents property data
 */
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
  nearby_places: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  coverImages?: string[]; // For backward compatibility
  gridImages?: string[]; // For backward compatibility
  agent_id?: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
  };
  created_at?: string;
  updated_at?: string;
  object_id?: string;
  template_id?: string;
  floorplanEmbedScript?: string;
  floorplans?: PropertyFloorplan[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  technicalItems?: PropertyTechnicalItem[];
  areaPhotos?: string[];
}
