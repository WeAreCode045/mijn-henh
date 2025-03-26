
/**
 * Represents an image in an area with sort order
 */
export interface AreaImage {
  ImageID: string;
  imageSortOrder: number;
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
