
// Re-export all property types from the main property.d.ts file
export type {
  PropertyFeature,
  PropertyArea,
  PropertyImage,
  PropertyFloorplan,
  PropertyNearbyPlace,
  PropertyPlaceType,
  PropertyCity,
  PropertyAgent,
  GeneralInfoData,
  PropertyData,
  PropertyFormData,
  PropertySubmitData,
  Area,
  AreaImage
} from '../property';

// Re-export types from PropertyDataTypes.ts that don't conflict
export { type PropertyData as PropertyDataType } from './PropertyDataTypes';

// Re-export types from PropertyTypes.ts
export type { 
  PropertyFloorplan as PropertyFloorplanType,
  PropertyNearbyPlace as PropertyNearbyPlaceType
} from './PropertyTypes';
