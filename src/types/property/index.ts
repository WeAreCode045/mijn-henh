
// Property place type
export interface PropertyPlaceType {
  id: string;
  place_id: string; // Making this required since it's used in several places
  name: string;
  vicinity?: string;
  type: string;
  types?: string[];
  distance?: number;
  visible_in_webview?: boolean;
  rating?: number;
  user_ratings_total?: number;
}

// Re-exports for backwards compatibility
export * from './PropertyTypes';
export * from './PropertyImageTypes';
// Export PropertyFloorplan from its own file to avoid ambiguity
export { PropertyFloorplan } from './PropertyFloorplanTypes';
export * from './PropertyAreaTypes';
export * from './PropertyFormTypes';
export * from './PropertyDataTypes';

// Import AreaImage type correctly
import { AreaImage } from '../area';
export type { AreaImage };
