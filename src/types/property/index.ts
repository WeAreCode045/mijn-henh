
// Re-export types from separate files using 'export type' syntax
export type { PropertyImage } from './PropertyImageTypes';
export type { PropertyArea } from './PropertyAreaTypes';
export type { PropertyData } from './PropertyDataTypes';
export type { PropertyFormData } from './PropertyFormTypes';

// Re-export types from PropertyTypes.ts 
export type {
  PropertyFeature,
  PropertyFloorplan,
  PropertyNearbyPlace,
  PropertyPlaceType,
  PropertyCity,
  PropertyAgent,
  PropertySubmitData,
  GeneralInfoData,
} from './PropertyTypes';

// Re-export types from Area types
export type { Area, AreaImage, AreaImageData } from '../area';
