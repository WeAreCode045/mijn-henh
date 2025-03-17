
// Re-export types from separate files using 'export type' syntax
export type { PropertyImage } from './PropertyImageTypes';
export type { PropertyArea } from './PropertyAreaTypes';

// Re-export types from PropertyTypes.ts using 'export type' syntax
export type {
  PropertyFeature,
  PropertyFloorplan,
  PropertyNearbyPlace,
  PropertyPlaceType,
  PropertyCity,
  PropertyAgent,
  GeneralInfoData,
  PropertySubmitData,
} from './PropertyTypes';

// Re-export types from PropertyDataTypes.ts
export type { PropertyData } from './PropertyDataTypes';

// Re-export types from PropertyFormTypes.ts
export type { PropertyFormData } from './PropertyFormTypes';

// Re-export types from Area types if needed
export type { Area, AreaImage } from '../area';
