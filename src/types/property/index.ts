
// Re-export types from PropertyTypes.ts
export type {
  PropertyFeature,
  PropertyArea,
  PropertyImage,
  PropertyFloorplan,
  PropertyCity,
  PropertyFormData,
  PropertySubmitData,
  PropertyAgent,
  Area
} from './PropertyTypes';

// Re-export types from PropertyPlaceTypes.ts
export type {
  PropertyPlaceType,
  PropertyNearbyPlace
} from './PropertyPlaceTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export type { PropertyData } from './PropertyDataTypes';

// Re-export AreaImage from PropertyAreaTypes.ts directly
export type { AreaImage } from './PropertyAreaTypes';
