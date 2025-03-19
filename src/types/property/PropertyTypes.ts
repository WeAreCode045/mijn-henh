
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
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
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
  propertyDetails?: {
    title?: string;
    price?: string;
    address?: string;
    objectId?: string;
  };
  description?: {
    shortDescription?: string;
    fullDescription?: string;
  };
  keyInformation?: {
    buildYear?: string;
    lotSize?: string;
    livingArea?: string;
    bedrooms?: string;
    bathrooms?: string;
    energyClass?: string;
    garages?: string;
    hasGarden?: boolean;
  };
  [key: string]: any;
}

/**
 * Enum for property tab values
 */
export enum PropertyTabsValue {
  OVERVIEW = "overview",
  CONTENT = "content",
  MEDIA = "media",
  LOCATION = "location",
  COMMUNICATIONS = "communications",
  SETTINGS = "settings",
  DASHBOARD = "dashboard"
}
