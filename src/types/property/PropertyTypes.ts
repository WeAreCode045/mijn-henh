
import { PropertyArea } from './PropertyDataTypes';
import { PropertyFloorplan } from './PropertyFloorplanTypes';
import { PropertyImage } from './PropertyImageTypes';
import { PropertyCity, PropertyNearbyPlace, PropertyPlaceType } from './PropertyLocationTypes';

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
  columns?: number; // Added based on the error message
}
