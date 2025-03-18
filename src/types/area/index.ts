
export { type AreaImageData } from './AreaImageData';

export interface Area {
  id: string;
  name: string;
  size: string;
  unit?: string;
  title?: string;
  description?: string;
}

export interface AreaImage {
  id: string;
  url: string;
  area: string;
  type: "image" | "floorplan";
}
