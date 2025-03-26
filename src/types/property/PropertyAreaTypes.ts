
/**
 * Represents an image in an area with sort order
 */
export interface AreaImage {
  id?: string;
  ImageID: string;
  imageSortOrder: number;
  url?: string;
}

/**
 * Represents an area of a property
 */
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  title: string;
  description: string;
  imageIds: string[]; // Explicitly defined property
  columns: number;
  images: PropertyImage[] | string[];
  areaImages?: AreaImage[]; // New property for the updated format
}

import { PropertyImage } from './PropertyTypes';
