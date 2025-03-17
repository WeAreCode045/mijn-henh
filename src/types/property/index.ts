
// Re-export types from separate files
export { PropertyImage } from './PropertyImageTypes';
export { PropertyArea } from './PropertyAreaTypes';

// Re-export types from PropertyTypes.ts
export {
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
export { PropertyData } from './PropertyDataTypes';

// Re-export types from PropertyFormTypes.ts
export { PropertyFormData } from './PropertyFormTypes';

// Re-export types from Area types if needed
export type { Area, AreaImage } from '../area';
