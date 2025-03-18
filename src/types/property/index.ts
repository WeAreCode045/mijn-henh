// Re-exports from other type files
export * from './PropertyTypes';
export * from './PropertyImageTypes';
export * from './PropertyAreaTypes';
export * from './PropertyFormTypes';
export * from './PropertyDataTypes';

// Export PropertyFloorplan using 'export type' syntax to avoid duplicate export error
export type { PropertyFloorplan } from './PropertyFloorplanTypes';

// Import AreaImage type correctly
import { AreaImage } from '../area';
export type { AreaImage };

// Property place type - keeping this for backwards compatibility
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
