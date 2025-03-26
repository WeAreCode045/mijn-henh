
import { PropertyFormData, PropertySubmitData } from "@/types/property";
import { preparePropertiesForJsonField, prepareAreasForFormSubmission, prepareImagesForSubmission } from "./preparePropertyData";

export function usePropertyDataPreparer() {
  // Helper function to convert data to string JSON
  const prepareJsonString = (data: any[]): string => {
    return JSON.stringify(preparePropertiesForJsonField(data));
  };

  const prepareSubmitData = (formData: PropertyFormData): PropertySubmitData => {
    // Use preparePropertiesForJsonField but then stringify for the database
    const featuresJson = prepareJsonString(formData.features || []);
    const nearby_placesJson = prepareJsonString(formData.nearby_places || []);
    const nearby_citiesJson = prepareJsonString(formData.nearby_cities || []);
    
    // Convert areas to appropriate format
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas || []);
    
    // Extract just the URLs for type compatibility
    const imageUrls = prepareImagesForSubmission(formData.images || []);
    
    return {
      title: formData.title,
      price: formData.price,
      address: formData.address,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      sqft: formData.sqft,
      livingArea: formData.livingArea,
      buildYear: formData.buildYear,
      garages: formData.garages,
      energyLabel: formData.energyLabel,
      hasGarden: formData.hasGarden,
      description: formData.description,
      shortDescription: formData.shortDescription,
      location_description: formData.location_description,
      features: featuresJson,
      areas: areasForSubmission as any,
      nearby_places: nearby_placesJson,
      nearby_cities: nearby_citiesJson,
      latitude: formData.latitude,
      longitude: formData.longitude,
      map_image: formData.map_image,
      object_id: formData.object_id,
      agent_id: formData.agent_id,
      template_id: formData.template_id,
      virtualTourUrl: formData.virtualTourUrl,
      youtubeUrl: formData.youtubeUrl,
      floorplanEmbedScript: formData.floorplanEmbedScript || "",
      // Use the extracted URL strings
      images: imageUrls
    };
  };

  return { prepareSubmitData };
}
