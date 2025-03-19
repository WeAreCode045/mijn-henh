
import { PropertyArea } from './PropertyAreaTypes';
import { PropertyImage } from './PropertyImageTypes';

/**
 * Represents a property feature
 */
export interface PropertyFeature {
  id: string;
  description: string;
}

/**
 * Represents a nearby place
 */
export interface PropertyPlaceType {
  id: string;
  place_id: string;
  name: string;
  vicinity?: string;
  type: string;
  types?: string[];
  distance?: number;
  rating?: number;
  user_ratings_total?: number;
  visible_in_webview?: boolean;
}

/**
 * Represents a nearby city
 */
export interface PropertyCity {
  id: string;
  name: string;
  distance?: number;
  population?: number;
}

/**
 * Represents a property agent
 */
export interface PropertyAgent {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  whatsapp_number?: string;
}

/**
 * Represents a property floorplan
 */
export interface PropertyFloorplan {
  id: string;
  url: string;
  property_id?: string;
  title?: string;
  description?: string;
  sort_order?: number;
  type: 'floorplan';
  alt?: string;
}

/**
 * Represents general information data for a property
 */
export interface GeneralInfoData {
  propertyType?: string;
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
}
