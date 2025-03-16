
import { PropertyData } from "../property";
import { PropertyCity } from "../property";
import { PropertyFeature } from "../property";
import { PropertyArea } from "../property";
import { PropertyNearbyPlace } from "../property";
import { PropertyAgent } from "../property";
import { GeneralInfoData } from "../property";

// Property form data extends PropertyData
export interface PropertyFormData extends Partial<PropertyData> {
  id: string;
  title?: string; // Make optional for form
  areaPhotos?: string[];
  coverImages?: string[];
  gridImages?: string[];
  nearby_cities?: PropertyCity[];
  created_at?: string;
  updated_at?: string;
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
  areas: PropertyArea[];
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
