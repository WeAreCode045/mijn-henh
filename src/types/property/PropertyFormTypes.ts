
import type { 
  PropertyFeature, 
  PropertyPlaceType, 
  PropertyCity, 
  PropertyFloorplan, 
  PropertyAgent, 
  GeneralInfoData 
} from "./PropertyTypes";
import { PropertyImage } from "./PropertyImageTypes";
import { PropertyArea } from "./PropertyAreaTypes";
import type { PropertyData } from "./PropertyDataTypes";

// Property form data extends PropertyData
export interface PropertyFormData {
  id: string;
  title: string; // Make title required
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
  images?: PropertyImage[] | string[];
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
  floorplans?: (PropertyFloorplan | PropertyImage | string)[];
  floorplanEmbedScript?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  propertyType?: string;
  generalInfo?: GeneralInfoData;
  // Backward compatibility fields
  created_at?: string;
  updated_at?: string;
  coverImages?: PropertyImage[];
  gridImages?: PropertyImage[];
  areaPhotos?: string[];
}
