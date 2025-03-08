
import type { PropertyFormData } from "@/types/property";

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
  template_id: "default", // Set default template_id
  floorplans: [], // Empty floorplans array
  floorplanEmbedScript: "", // Empty floorplanEmbedScript with empty string default
  virtualTourUrl: "",
  youtubeUrl: "",
  areaPhotos: [], // Empty areaPhotos array
  coverImages: [], // Empty coverImages array for backward compatibility
  gridImages: [] // Empty gridImages array for backward compatibility
};
