
import { PropertyFormData, PropertyData, PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { prepareAreasForFormSubmission, prepareFloorplansForFormSubmission } from "@/hooks/property-form/preparePropertyData";

export function createPropertyDataFromFormData(formData: PropertyFormData): PropertyData {
  return {
    ...formData,
    id: formData.id || crypto.randomUUID(),
    features: formData.features || [],
    images: formData.images || [],
    floorplans: formData.floorplans || [],
    areas: formData.areas || [],
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    sqft: formData.sqft || '',
    livingArea: formData.livingArea || '',
    buildYear: formData.buildYear || '',
    garages: formData.garages || '',
    energyLabel: formData.energyLabel || '',
    hasGarden: formData.hasGarden || false,
    description: formData.description || '',
    featuredImage: formData.featuredImage || null,
    coverImages: formData.coverImages || []
  };
}

export function createSubmitDataFromPropertyData(propertyData: PropertyData, selectedAgent: string | null): PropertySubmitData {
  const areasWithColumns = prepareAreasForFormSubmission(propertyData.areas);
  const floorplansForDb = prepareFloorplansForFormSubmission(propertyData.floorplans);

  return {
    id: propertyData.id,
    title: propertyData.title,
    price: propertyData.price,
    address: propertyData.address,
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    sqft: propertyData.sqft,
    livingArea: propertyData.livingArea,
    buildYear: propertyData.buildYear,
    garages: propertyData.garages,
    energyLabel: propertyData.energyLabel,
    hasGarden: propertyData.hasGarden,
    description: propertyData.description,
    location_description: propertyData.location_description,
    floorplans: floorplansForDb,
    featuredImage: propertyData.featuredImage,
    coverImages: propertyData.coverImages,
    areaPhotos: propertyData.areaPhotos,
    features: propertyData.features as unknown as Json,
    areas: areasWithColumns as unknown as Json[],
    nearby_places: propertyData.nearby_places as unknown as Json,
    images: propertyData.images.map(img => img.url),
    latitude: propertyData.latitude,
    longitude: propertyData.longitude,
    object_id: propertyData.object_id,
    map_image: propertyData.map_image,
    agent_id: selectedAgent || null
  };
}
