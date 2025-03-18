
import { PropertyImage } from './property';

/**
 * Represents an area
 */
export interface Area {
  id: string;
  name?: string;
  size?: string;
  title?: string;
  description?: string;
  images?: string[] | { url: string; id: string; }[];
  imageIds?: string[];
  columns?: number;
  unit?: string;
}

/**
 * Represents an area image
 */
export type AreaImage = PropertyImage | { url: string; id: string; };
