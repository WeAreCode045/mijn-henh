
import { PropertyFormData, PropertySubmitData } from "@/types/property";
import { 
  prepareAreasForFormSubmission, 
  preparePropertiesForJsonField,
  prepareImagesForSubmission
} from "./preparePropertyData";

export function usePropertyDataPreparer() {
  const prepareSubmitData = (formData: PropertyFormData): PropertySubmitData => {
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas);
    const featuresJson = preparePropertiesForJsonField(formData.features);
    const nearby_placesJson = preparePropertiesForJsonField(formData.nearby_places || []);
    const nearby_citiesJson = preparePropertiesForJsonField(formData.nearby_cities || []);
    
    // Note: Since we use property_images table, we don't need to include image URLs in the property record
    // Images are handled separately via the property_images table
    
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
      location_description: formData.location_description,
      features: featuresJson as string,
      areas: areasForSubmission as any,
      nearby_places: nearby_placesJson as string,
      nearby_cities: nearby_citiesJson as string,
      latitude: formData.latitude,
      longitude: formData.longitude,
      map_image: formData.map_image,
      object_id: formData.object_id,
      agent_id: formData.agent_id,
      template_id: formData.template_id,
      virtualTourUrl: formData.virtualTourUrl,
      youtubeUrl: formData.youtubeUrl,
      floorplanEmbedScript: formData.floorplanEmbedScript || "",
      // We need to include images for type compatibility, but it will be removed in the database hook
      images: formData.images || []
    };
  };

  return { prepareSubmitData };
}
