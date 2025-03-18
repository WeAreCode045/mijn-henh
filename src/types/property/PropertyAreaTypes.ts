
import { PropertyImage } from './PropertyImageTypes';

/**
 * Represents a property area
 */
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  unit?: string;
  title?: string;
  description?: string;
  images: PropertyImage[];
  imageIds?: string[];
  columns?: number;
}
