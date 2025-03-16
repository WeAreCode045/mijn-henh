
// Re-export types from property.d.ts
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
  PropertySubmitData
} from '../property';

// Re-export types from PropertyDataTypes.ts that don't conflict
export { type PropertyData as PropertyDataType } from './PropertyDataTypes';
