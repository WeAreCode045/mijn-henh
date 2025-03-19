
import { PropertyFormData, PropertyImage, PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity, PropertyFloorplan } from "@/types/property";
import { initialFormData } from "../initialFormData";
import { formatAgentData } from "./agentUtils";
import { formatGeneralInfo, createDefaultGeneralInfo } from "./generalInfoUtils";
import { safeParseArray } from "./arrayUtils";
import { convertToPropertyImageArray, convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

/**
 * Maps raw property data from the API to the PropertyFormData structure
 */
export const mapPropertyDataToFormData = (propertyData: any, images: PropertyImage[] = []): PropertyFormData => {
  if (!propertyData) return initialFormData;
  
  // Process images
  const processedImages = Array.isArray(images) ? images : [];
  const regularImages = processedImages.filter(img => img.type === 'image' || !img.type);
  const floorplanImages = processedImages.filter(img => img.type === 'floorplan');
  const featuredImage = regularImages.find(img => img.is_main)?.url || null;
  const featuredImages = regularImages
    .filter(img => img.is_featured_image)
    .map(img => img);
  
  // Parse JSON strings from the database to objects
  const features = safeParseArray(propertyData.features);
  const areas = safeParseArray(propertyData.areas);
  const nearby_places = safeParseArray(propertyData.nearby_places);
  const nearby_cities = safeParseArray(propertyData.nearby_cities || []);
  
  // Process agent data
  const agentData = propertyData.agent ? formatAgentData(propertyData.agent) : undefined;
  
  // Process generalInfo
  const generalInfo = formatGeneralInfo(propertyData.generalInfo) || createDefaultGeneralInfo(propertyData);
  
  // Get property type from either property_type property (if it exists) or generate an empty string
  const propertyType = propertyData.property_type || propertyData.propertyType || "";
  
  // Create a shortDescription if it doesn't exist
  const shortDescription = propertyData.shortDescription || propertyData.description || "";
  
  // Build and return the property form data
  return {
    ...initialFormData,
    ...propertyData,
    id: propertyData.id || "",
    title: propertyData.title || "",
    price: propertyData.price || "",
    address: propertyData.address || "",
    bedrooms: propertyData.bedrooms || "",
    bathrooms: propertyData.bathrooms || "",
    sqft: propertyData.sqft || "",
    livingArea: propertyData.livingArea || "",
    buildYear: propertyData.buildYear || "",
    garages: propertyData.garages || "",
    energyLabel: propertyData.energyLabel || "",
    hasGarden: !!propertyData.hasGarden,
    description: propertyData.description || "",
    shortDescription, // Use the prepared shortDescription
    features,
    areas,
    nearby_places,
    nearby_cities,
    images: convertToPropertyImageArray(regularImages),
    floorplans: convertToPropertyFloorplanArray(floorplanImages),
    featuredImage: featuredImage,
    featuredImages: featuredImages,
    agent: agentData,
    generalInfo, 
    coverImages: convertToPropertyImageArray(regularImages.filter(img => img.is_featured_image)),
    gridImages: convertToPropertyImageArray(regularImages.slice(0, 4)),
    areaPhotos: [],
    propertyType,
    virtualTourUrl: propertyData.virtualTourUrl || '',
    youtubeUrl: propertyData.youtubeUrl || '',
    floorplanEmbedScript: propertyData.floorplanEmbedScript || '',
    object_id: propertyData.object_id || '',
    agent_id: propertyData.agent_id || '',
    template_id: propertyData.template_id || 'default',
    latitude: propertyData.latitude || null,
    longitude: propertyData.longitude || null,
    location_description: propertyData.location_description || '',
    created_at: propertyData.created_at || new Date().toISOString(),
    updated_at: propertyData.updated_at || new Date().toISOString(),
  };
};
