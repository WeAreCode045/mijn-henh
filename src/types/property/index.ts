
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
  PropertyData,
  PropertyFormData,
  PropertySubmitData,
} from './PropertyTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export { type PropertyData as PropertyDataType } from './PropertyDataTypes';

// Re-export types from PropertyPlaceTypes.ts
export type { 
  PropertyPlaceType as PropertyPlaceTypeBase,
  PropertyNearbyPlace as PropertyNearbyPlaceBase 
} from './PropertyPlaceTypes';

// Re-export types from PropertyTypes.ts
export type { 
  PropertyFloorplan as PropertyFloorplanType,
  PropertyNearbyPlace as PropertyNearbyPlaceType
} from './PropertyTypes';

// Re-export Area types
export type { Area, AreaImage } from '../area';
