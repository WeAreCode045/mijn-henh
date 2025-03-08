
export * from './PropertyAreaTypes';
export * from './PropertyBaseTypes';
export * from './PropertyDataTypes';
export * from './PropertyFeatureTypes';
export * from './PropertyImageTypes';
export * from './PropertyLocationTypes';
export * from './PropertyAgentTypes';
export * from './PropertyTechnicalTypes';
export * from './PropertyFloorplanTypes';

// For backwards compatibility, re-export PropertyNearbyPlace as PropertyPlaceType
import { PropertyNearbyPlace } from './PropertyLocationTypes';
export type PropertyPlaceType = PropertyNearbyPlace;
