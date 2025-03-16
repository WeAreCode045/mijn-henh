
import type {
  PropertyArea,
  PropertyFeature,
  PropertyNearbyPlace,
  PropertyCity,
  PropertyFloorplan,
  GeneralInfoData
} from './PropertyTypes';
import { PropertyImage } from './PropertyImageTypes';

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
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  areas: PropertyArea[];
  map_image: string | null;
  nearby_places: PropertyNearbyPlace[];
  nearby_cities: PropertyCity[];
  latitude: number | null;
  longitude: number | null;
  object_id: string;
  agent_id: string;
  template_id: string;
  floorplans: PropertyFloorplan[];
  floorplanEmbedScript: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  created_at: string;
  updated_at: string;
  agent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    address?: string;
  };
  // For backward compatibility
  coverImages: PropertyImage[];
  gridImages: PropertyImage[];
  generalInfo?: GeneralInfoData;
}
