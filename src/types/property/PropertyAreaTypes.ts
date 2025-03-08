
/**
 * Property area type definitions
 */

import { PropertyImage } from "./PropertyImageTypes";

export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  images: PropertyImage[];
  // Additional properties used in the application
  title: string;
  description: string;
  imageIds: string[];
  columns: number;
}
