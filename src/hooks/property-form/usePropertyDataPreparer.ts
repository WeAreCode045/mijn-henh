
import { PropertyFormData, PropertySubmitData, PropertyArea } from "@/types/property";
import { 
  prepareAreasForFormSubmission, 
  preparePropertiesForJsonField
} from "./preparePropertyData";

export function usePropertyDataPreparer() {
  const prepareSubmitData = (formData: PropertyFormData): PropertySubmitData => {
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas);
    const featuresJson = preparePropertiesForJsonField(formData.features);
    const nearby_placesJson = preparePropertiesForJsonField(formData.nearby_places || []);
    
    // Ensure technicalItems is treated as an array before transformation
    const technicalItemsArray = Array.isArray(formData.technicalItems) ? formData.technicalItems : [];
    const technicalItemsJson = preparePropertiesForJsonField(technicalItemsArray);
    
    console.log("usePropertyFormSubmit - Form submission - areas:", areasForSubmission);
    console.log("usePropertyFormSubmit - Form submission - features:", featuresJson);
    console.log("usePropertyFormSubmit - Form submission - technicalItems:", technicalItemsJson);
    
    // Convert image objects to URLs for database storage
    const imageUrls = formData.images.map(img => typeof img === 'string' ? img : img.url);
    
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
      features: featuresJson,
      areas: areasForSubmission as any,
      nearby_places: nearby_placesJson,
      latitude: formData.latitude,
      longitude: formData.longitude,
      map_image: formData.map_image,
      object_id: formData.object_id,
      agent_id: formData.agent_id,
      template_id: formData.template_id,
      virtualTourUrl: formData.virtualTourUrl,
      youtubeUrl: formData.youtubeUrl,
      images: imageUrls,
      technicalItems: technicalItemsJson,
      floorplanEmbedScript: formData.floorplanEmbedScript || ""
    };
  };

  return { prepareSubmitData };
}
