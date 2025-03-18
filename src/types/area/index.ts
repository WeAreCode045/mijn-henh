
export { type AreaImageData } from './AreaImageData';

export interface Area {
  id: string;
  name: string;
  size: string;
  unit?: string;
  title?: string;
  description?: string;
  imageIds?: string[];
  columns?: number;
  images?: (string | PropertyImage)[] | string[] | PropertyImage[];
}

export interface AreaImage {
  id: string;
  url: string;
  area: string;
  type: "image" | "floorplan" | string;
}
