
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";
import { usePropertyValidation } from "./property-form/usePropertyValidation";
import { usePropertyDatabase } from "./property-form/usePropertyDatabase";
import { 
  prepareAreasForFormSubmission, 
  prepareFloorplansForFormSubmission,
  preparePropertiesForJsonField
} from "./property-form/preparePropertyData";

export function usePropertyFormSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { updateProperty, createProperty } = usePropertyDatabase();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData) => {
    e.preventDefault();
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    if (!validatePropertyData(formData)) {
      return;
    }
    
    // Prepare data for submission using our utility functions
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas);
    const floorplansForSubmission = prepareFloorplansForFormSubmission(formData.floorplans);
    const featuresJson = preparePropertiesForJsonField(formData.features);
    const nearby_placesJson = preparePropertiesForJsonField(formData.nearby_places);
    
    console.log("usePropertyFormSubmit - Form submission - areas:", areasForSubmission);
    console.log("usePropertyFormSubmit - Form submission - floorplans:", floorplansForSubmission);
    
    const submitData: PropertySubmitData = {
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
      floorplans: floorplansForSubmission,
      featuredImage: formData.featuredImage,
      gridImages: formData.gridImages,
      map_image: formData.map_image,
      latitude: formData.latitude,
      longitude: formData.longitude,
      areas: areasForSubmission,
      nearby_places: nearby_placesJson,
      images: formData.images.map(img => img.url),
      object_id: formData.object_id
    };
    
    if (formData.id) {
      await updateProperty(formData.id, submitData);
    } else {
      await createProperty(submitData);
    }
  };

  return { handleSubmit };
}
