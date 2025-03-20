
import type {
  PropertyArea,
  PropertyFeature,
  PropertyImage,
  PropertyNearbyPlace,
  PropertyCity,
  PropertyFloorplan
} from './PropertyTypes';

export interface PropertyData {
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
  location_description?: string;
  features?: PropertyFeature[];
  images?: PropertyImage[] | string[] | { url: string }[];
  featuredImage?: string | null;
  featuredImages?: string[];
  areas?: PropertyArea[];
  map_image?: string | null;
  nearby_places?: PropertyNearbyPlace[];
  nearby_cities?: PropertyCity[];
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  template_id?: string;
  floorplans?: PropertyFloorplan[];
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  created_at?: string;
  updated_at?: string;
  status?: string; // Property status field
  metadata?: {
    status?: string;
    [key: string]: any;
  }; // Metadata object that can include status
  agent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
  };
}
