
import { PropertyData, PropertyFormData } from "@/types/property";

/**
 * Adapts property data to ensure all required fields are present
 */
export function adaptPropertyDataToFormData(property: PropertyData): PropertyFormData {
  // Create a new object with required PropertyData properties
  const propertyWithRequiredFields: PropertyData = {
    ...property,
    title: property.title || '', // Ensure title is set
    price: property.price || '',
    address: property.address || '',
    bedrooms: property.bedrooms || '',
    bathrooms: property.bathrooms || '',
    sqft: property.sqft || '',
    livingArea: property.livingArea || '',
    buildYear: property.buildYear || '',
    garages: property.garages || '',
    energyLabel: property.energyLabel || '',
    hasGarden: property.hasGarden || false,
    description: property.description || '',
    shortDescription: property.shortDescription || property.description || '',
    location_description: property.location_description || '',
    features: property.features || [],
    areas: property.areas || [],
    nearby_places: property.nearby_places || [],
    nearby_cities: property.nearby_cities || [],
    images: property.images || [],
    floorplans: property.floorplans || [],
    featuredImage: property.featuredImage || null,
    featuredImages: property.featuredImages || [],
    created_at: property.created_at || new Date().toISOString(),
    updated_at: property.updated_at || new Date().toISOString(),
    coverImages: property.coverImages || [],
    gridImages: property.gridImages || [],
    map_image: property.map_image || null,
    latitude: property.latitude || null,
    longitude: property.longitude || null,
    object_id: property.object_id || '',
    agent_id: property.agent_id || '',
    template_id: property.template_id || '',
    virtualTourUrl: property.virtualTourUrl || '',
    youtubeUrl: property.youtubeUrl || '',
    floorplanEmbedScript: property.floorplanEmbedScript || '',
    propertyType: property.propertyType || property.property_type || '',
    agent: property.agent ? {
      id: property.agent.id,
      name: property.agent.name,
      email: property.agent.email,
      phone: property.agent.phone,
      photoUrl: property.agent.photoUrl
    } : undefined,
    generalInfo: property.generalInfo || {
      propertyDetails: {
        title: property.title || '',
        price: property.price || '',
        address: property.address || '',
        objectId: property.object_id || '',
      },
      description: {
        shortDescription: property.shortDescription || property.description || '',
        fullDescription: property.description || '',
      },
      keyInformation: {
        buildYear: property.buildYear || '',
        lotSize: property.sqft || '',
        livingArea: property.livingArea || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        energyClass: property.energyLabel || '',
      }
    }
  };
  
  // Create a compatible PropertyFormData object with required title
  const propertyFormData: PropertyFormData = {
    ...propertyWithRequiredFields,
    title: propertyWithRequiredFields.title,
  };
  
  return propertyFormData;
}
