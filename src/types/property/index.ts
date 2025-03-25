
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
  Area,
  AreaImage
} from './PropertyTypes';

// Re-export types from PropertyPlaceTypes.ts
export type {
  PropertyPlaceType,
  PropertyNearbyPlace
} from './PropertyPlaceTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export type { PropertyData } from './PropertyDataTypes';

// Re-export types from PropertyAreaTypes.ts
export type { AreaImage as AreaImageType } from './PropertyAreaTypes';
