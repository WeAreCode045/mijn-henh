
import { PropertyFormData } from "@/types/property";

export const initialFormData: PropertyFormData = {
  id: "",
  title: "",
  price: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  livingArea: "",
  buildYear: "",
  garages: "",
  energyLabel: "",
  hasGarden: false,
  description: "",
  shortDescription: "",
  location_description: "",
  features: [],
  images: [],
  featuredImage: null,
  featuredImages: [],
  areas: [],
  map_image: null,
  nearby_places: [],
  nearby_cities: [],
  latitude: null,
  longitude: null,
  object_id: "",
  agent_id: "",
  agent: null,
  template_id: "",
  floorplans: [],
  floorplanEmbedScript: "",
  virtualTourUrl: "",
  youtubeUrl: "",
  notes: "",
  generalInfo: undefined,
  propertyType: "", // Add property type with empty default
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  coverImages: [],
  gridImages: [],
  areaPhotos: []
};
