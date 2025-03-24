
// Re-export types from PropertyTypes.ts
export type {
  PropertyFeature,
  PropertyArea,
  PropertyImage,
  PropertyFloorplan,
  PropertyNearbyPlace,
  PropertyCity,
  PropertyPlaceType,
  PropertyFormData,
  PropertySubmitData,
  PropertyAgent
} from './PropertyTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export type { PropertyData } from './PropertyDataTypes';

// Add Area as an alias to PropertyArea for backward compatibility
import { PropertyArea } from './PropertyTypes';
export type Area = PropertyArea;
