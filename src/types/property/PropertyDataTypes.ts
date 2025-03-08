
import { Json } from "@/integrations/supabase/types";
import { BasePropertyData } from "./PropertyBaseTypes";

// PropertyData requires id
export interface PropertyData extends BasePropertyData {
  id: string;
}

// PropertyFormData makes id optional
export interface PropertyFormData extends BasePropertyData {
  id?: string;
  created_at?: string;
  updated_at?: string;
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
  floorplans?: Json;
  technicalItems?: Json;
  featuredImage: string | null;
  featuredImages: string[];
  coverImages?: string[];
  gridImages?: string[];
  areaPhotos?: string[];
  object_id?: string;
  map_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features: Json;
  areas: Json[];
  nearby_places: Json;
  images: string[];
  agent_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  template_id?: string;
  floorplanEmbedScript?: string;
}

export interface PropertyDatabaseData {
  id?: string;
  title?: string;
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
  features?: Json;
  floorplans?: Json;
  featuredImage?: string | null;
  featuredImages?: string[];
  coverImages?: string[];
  gridImages?: string[];
  areas?: Json[];
  areaPhotos?: string[];
  object_id?: string;
  map_image?: string | null;
  nearby_places?: Json;
  latitude?: number | null;
  longitude?: number | null;
  agent_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
  floorplanEmbedScript?: string;
}
