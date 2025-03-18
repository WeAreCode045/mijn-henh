
import { PropertyImage } from "./PropertyImageTypes";

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
  imageIds?: string[];
  columns?: number;
  images: (PropertyImage)[];
}
