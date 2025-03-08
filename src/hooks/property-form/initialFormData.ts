
import type { PropertyFormData } from "@/types/property";

export const initialFormData: PropertyFormData = {
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
  latitude: null,
  longitude: null,
  template_id: "default", // Set default template_id
  floorplans: [], // Empty floorplans array
  floorplanEmbedScript: "", // Empty floorplanEmbedScript with empty string default
  virtualTourUrl: "",
  youtubeUrl: "",
  nearby_cities: [], // Empty nearby_cities array
  areaPhotos: [], // Empty areaPhotos array
  technicalItems: [] // Empty technicalItems array
};
