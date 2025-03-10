
// Fix Json type issues by using the preparePropertiesForJsonField and similar helper functions

import { PropertySubmitData, PropertyData } from "@/types/property";
import { prepareAreasForFormSubmission, preparePropertiesForJsonField, prepareFloorplansForFormSubmission } from "@/hooks/property-form/preparePropertyData";

interface PropertyDataAdapterProps {
  propertyData: PropertyData;
  onSubmit: (data: PropertySubmitData) => Promise<void>;
}

export const PropertyDataAdapter = ({ propertyData, onSubmit }: PropertyDataAdapterProps) => {
  const handleSubmit = async () => {
    if (!propertyData) return;

    // Transform the data to match the expected types
    const featuresJson = preparePropertiesForJsonField(propertyData.features);
    const floorplansJson = prepareFloorplansForFormSubmission(propertyData.floorplans);
    const areasJson = prepareAreasForFormSubmission(propertyData.areas);
    const nearbyPlacesJson = preparePropertiesForJsonField(propertyData.nearby_places || []);

    const submitData: PropertySubmitData = {
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
      features: featuresJson,
      floorplans: floorplansJson,
      featuredImage: propertyData.featuredImage,
      featuredImages: propertyData.featuredImages || [],
      coverImages: propertyData.coverImages || [],
      areas: areasJson,
      map_image: propertyData.map_image,
      nearby_places: nearbyPlacesJson,
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
      images: propertyData.images.map(img => typeof img === 'string' ? img : img.url),
      agent_id: propertyData.agent_id
    };

    await onSubmit(submitData);
  };

  return null; // This component doesn't render anything
};
