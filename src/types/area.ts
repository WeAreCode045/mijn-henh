
import { PropertyImage } from './property';

export interface Area {
  id: string;
  name?: string;
  size?: string;
  title?: string;
  description?: string;
  images?: string[] | { url: string; id: string; }[];
  imageIds?: string[];
  columns?: number;
}
