
import type {
  PropertyFeature,
  PropertyPlaceType,
  PropertyCity,
  PropertyFloorplan,
  GeneralInfoData,
  PropertyAgent,
  PropertyNearbyPlace
} from './PropertyTypes';
import type { PropertyImage } from './PropertyImageTypes';
import type { PropertyArea } from './PropertyAreaTypes';

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
  shortDescription?: string;
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
  agent?: PropertyAgent;
  template_id: string;
  floorplans: (PropertyFloorplan | PropertyImage | string)[];
  floorplanEmbedScript: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  notes?: string;
  propertyType?: string;
  created_at: string;
  updated_at: string;
  // For backward compatibility
  coverImages: PropertyImage[];
  gridImages: PropertyImage[];
  areaPhotos?: string[];
  generalInfo?: GeneralInfoData;
}
