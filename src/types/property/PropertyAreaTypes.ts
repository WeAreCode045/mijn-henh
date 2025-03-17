
import { PropertyImage } from './PropertyImageTypes';

/**
 * Represents an area of a property
 */
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  unit?: string;
  title: string;
  description: string;
  imageIds: string[]; // Array of image IDs
  columns: number;
  images: (PropertyImage | string)[];
}
