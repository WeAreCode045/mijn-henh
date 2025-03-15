
import { PropertyImage } from './PropertyImageTypes';

/**
 * Represents an area of a property
 */
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  title: string;
  description: string;
  imageIds: string[]; // Add this property
  columns: number;
  images: PropertyImage[] | string[];
}
