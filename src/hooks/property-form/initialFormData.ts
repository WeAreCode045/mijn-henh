
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
  featuredImages: [], // For featured images (previously coverImages)
  coverImages: [], // Keep for backward compatibility
  gridImages: [], // Keep for backward compatibility
  areas: [],
  map_image: null,
  nearby_places: [],
  latitude: null,
  longitude: null,
  template_id: "default", // Set default template_id
  floorplans: [], // Add empty floorplans array
  floorplanEmbedScript: "", // Add empty floorplanEmbedScript with empty string default
  virtualTourUrl: "",
  youtubeUrl: ""
};
