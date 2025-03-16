
// Re-export types from separate files
export type { PropertyImage } from './PropertyImageTypes';

// Re-export types from PropertyTypes.ts
export type {
  PropertyFeature,
  PropertyArea,
  PropertyFloorplan,
  PropertyNearbyPlace,
  PropertyPlaceType,
  PropertyCity,
  PropertyAgent,
  GeneralInfoData,
  PropertySubmitData,
} from './PropertyTypes';

// Re-export types from PropertyDataTypes.ts
export { type PropertyData } from './PropertyDataTypes';

// Re-export types from PropertyFormTypes.ts
export { type PropertyFormData } from './PropertyFormTypes';

// Re-export types from PropertyPlaceTypes.ts
export type { 
  PropertyPlaceType as PropertyPlaceTypeBase,
  PropertyNearbyPlace as PropertyNearbyPlaceBase 
} from './PropertyPlaceTypes';

// Re-export Area types
export type { Area, AreaImage } from '../area';
