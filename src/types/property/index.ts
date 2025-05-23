
// Re-export types from PropertyTypes.ts
export type {
  PropertyFeature,
  PropertyArea,
  PropertyImage,
  PropertyCity,
  PropertyAgent,
  PropertyParticipant,
  ParticipantRole,
  ParticipantStatus
} from './PropertyTypes';

// Re-export types from PropertyPlaceTypes.ts
export type {
  PropertyPlaceType,
  PropertyNearbyPlace
} from './PropertyPlaceTypes';

// Re-export types from PropertyDataTypes.ts that don't conflict
export type { PropertyData } from './PropertyDataTypes';

// Re-export AreaImage from PropertyAreaTypes.ts
export type { AreaImage } from './PropertyAreaTypes';
