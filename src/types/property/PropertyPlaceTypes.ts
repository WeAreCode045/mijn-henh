
export interface PropertyPlaceType {
  id: string;
  name: string;
  icon?: string;
  [key: string]: unknown;
}

export interface PropertyNearbyPlace {
  id: string;
  name: string;
  distance?: string;
  category?: string;
  icon?: string;
  [key: string]: unknown;
}
