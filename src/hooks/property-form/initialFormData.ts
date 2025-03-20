
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
  floorplans: [], 
  floorplanEmbedScript: "", 
  virtualTourUrl: "",
  youtubeUrl: "",
  // For backward compatibility
  areaPhotos: [], 
  coverImages: [],
  gridImages: []
};
