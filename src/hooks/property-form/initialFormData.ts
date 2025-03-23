
import type { PropertyFormData } from "@/types/property";

export const initialFormData: PropertyFormData = {
  id: '',
  title: '',
  price: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  livingArea: '',
  buildYear: '',
  garages: '',
  energyLabel: '',
  hasGarden: false,
  description: '',
  shortDescription: '',
  location_description: '',
  features: [],
  areas: [],
  images: [],
  nearby_places: [],
  nearby_cities: [],
  floorplans: [],
  featuredImage: null,
  featuredImages: [],
  coverImages: [],
  gridImages: [],
  areaPhotos: [],
  status: 'Draft', // Default status is 'Draft'
  propertyType: '', // Default propertyType is empty string
  archived: false, // Default archived status is false
  latitude: null,
  longitude: null,
  map_image: null,
  object_id: '',
  agent_id: '',
  floorplanEmbedScript: '',
  virtualTourUrl: '',
  youtubeUrl: '',
};
