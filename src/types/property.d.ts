
export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyArea {
  id: string;
  title: string;
  description: string;
  images?: string[];
}

export interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: string;
  address: string;
  features: PropertyFeature[];
  areas?: PropertyArea[];
  images?: string[];
  floorplans?: string[];
  gridImages?: string[];
  featuredImage?: string;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  buildYear?: string;
  livingArea?: string;
  sqft?: string;
  areaPhotos?: string[];
  currentPath?: string;
}
