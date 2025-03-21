
import { PropertyData } from "../property";
import { PropertyCity } from "../property";
import { PropertyFeature } from "../property";
import { PropertyArea } from "../property";
import { PropertyNearbyPlace } from "../property";
import { PropertyAgent } from "../property";
import { PropertyImage } from "../property";

// Property form data extends PropertyData
export interface PropertyFormData extends PropertyData {
  areaPhotos?: PropertyImage[] | string[];
  coverImages?: PropertyImage[] | string[];
  gridImages?: PropertyImage[] | string[];
  nearby_cities?: PropertyCity[];
  status?: string; // Added status property
  propertyType?: string; // Added propertyType property
  metadata?: {
    status?: string;
    [key: string]: any;
  };
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
  areas: any;
  nearby_places?: string;
  nearby_cities?: string;
  latitude?: number | null;
  longitude?: number | null;
  map_image?: string | null;
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
  status?: string; // Added status property
  propertyType?: string; // Added propertyType property
  metadata?: {
    status?: string;
    [key: string]: any;
  }; // Added metadata property
}
