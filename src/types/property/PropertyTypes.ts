
import { Json } from "@/integrations/supabase/types";
import { 
  PropertyArea, 
  PropertyAreaImage 
} from "./PropertyAreaTypes";
import { PropertyFeature } from './PropertyFeatureTypes';
import { PropertyCity } from './PropertyCityTypes';
import { PropertyPlace } from './PropertyPlaceTypes';
import { PropertyBaseTypes } from './PropertyBaseTypes';
import { PropertyImage } from "./PropertyImageTypes";
import { ParticipantRole as ParticipantRoleType } from "@/types/participant";

export type { 
  PropertyArea, 
  PropertyAreaImage,
  PropertyBaseTypes,
  PropertyCity,
  PropertyFeature,
  PropertyImage,
  PropertyPlace
};

export type PropertyParticipant = {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRoleType;
  status: string;
  created_at: string;
  updated_at: string;
  documents_signed: string[];
  webview_approved: boolean;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
};

export type ParticipantRole = ParticipantRoleType;

export interface PropertyFormData {
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
  description: string;
  object_id?: string;
  shortDescription?: string;
  status?: string;
  propertyType?: string;
  archived?: boolean;
  generalInfo?: Json;
  metadata?: Json;
  agent_id?: string;
  seller_id?: string;
  buyer_id?: string;
  latitude?: number;
  longitude?: number;
  hasGarden?: boolean;
}
