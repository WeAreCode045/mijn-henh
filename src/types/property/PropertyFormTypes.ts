
import type { PropertyData, PropertyCity, PropertyFeature, PropertyArea, PropertyAgent, GeneralInfoData } from "../property";
import { PropertyImage } from "./PropertyImageTypes";
import { PropertyPlaceType } from "./PropertyPlaceTypes";
import type { Json } from "@/integrations/supabase/types";

// Property form data extends PropertyData
export interface PropertyFormData {
  id: string;
  title: string; // Make title required to match PropertyData
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
  shortDescription?: string;
  location_description?: string;
  features?: PropertyFeature[];
  images?: PropertyImage[];
  featuredImage?: string | null;
  featuredImages?: string[];
  areas?: PropertyArea[];
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  nearby_cities?: PropertyCity[];
  latitude?: number | null;
  longitude?: number | null;
  object_id?: string;
  agent_id?: string;
  agent?: PropertyAgent;
  template_id?: string;
  floorplans?: PropertyImage[];
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  generalInfo?: GeneralInfoData;
  // Backward compatibility fields
  created_at?: string;
  updated_at?: string;
  coverImages?: PropertyImage[];
  gridImages?: PropertyImage[];
  areaPhotos?: string[];
}

// Property submit data
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
  shortDescription?: string;
  location_description?: string;
  features: string;
  images: string[];
  areas: string;
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
  floorplanEmbedScript?: string;
  generalInfo?: string;
}
