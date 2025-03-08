
import { PropertyDataTypes } from './PropertyDataTypes';

export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  description: string;
  images: string[] | { url: string }[];
  title: string;
  imageIds: string[];
  columns: number;
}

export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
  columns?: number;
}

// Export other types from this file as needed
