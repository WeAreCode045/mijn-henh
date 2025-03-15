
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
  imageIds: string[]; // Adding this property to fix TypeScript errors
  columns: number;
  images: PropertyImage[] | string[];
}
