
import { Json } from "@/integrations/supabase/types";
import { PropertyFeature } from "./PropertyFeatureTypes";
import { PropertyImage } from "./PropertyImageTypes";
import { PropertyArea } from "./PropertyAreaTypes";
import { PropertyTechnicalItem, PropertyFloorplan } from "./PropertyTechnicalTypes";
import { PropertyPlaceType } from "./PropertyLocationTypes";
import { PropertyAgent } from "./PropertyAgentTypes";

// Base interface with common properties
export interface BasePropertyData {
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
  features: PropertyFeature[];
  images: PropertyImage[];
  floorplans?: PropertyFloorplan[]; 
  technicalItems?: PropertyTechnicalItem[];
  featuredImage: string | null;
  featuredImages: string[];
  coverImages?: string[]; 
  gridImages?: string[]; 
  areas: PropertyArea[];
  areaPhotos?: string[];
  currentPath?: string;
  object_id?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  nearby_cities?: Array<{name: string, distance: number, visible_in_webview?: boolean}>;
  latitude?: number | null;
  longitude?: number | null;
  agent_id?: string;
  agent?: PropertyAgent;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
  floorplanEmbedScript?: string;
}
