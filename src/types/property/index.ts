
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
  PropertyAgent,
  Area
} from './PropertyTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export type { PropertyData } from './PropertyDataTypes';
