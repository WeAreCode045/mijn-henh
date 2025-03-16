
import { PropertyImage } from './property/PropertyImageTypes';

export interface AreaImage {
  id: string;
  url: string;
  type: "image" | "floorplan"; // Match PropertyImage's type definition exactly
}

export interface Area {
  id: string;
  name?: string;
  size?: string;
  title?: string;
  description?: string;
  images?: PropertyImage[] | string[] | { url: string; id: string; }[];
  imageIds?: string[];
  columns?: number;
}
