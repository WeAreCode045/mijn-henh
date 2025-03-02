
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

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    // Prevent the default form submission behavior
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    console.log("usePropertyFormSubmit - Features to submit:", formData.features);
    console.log("usePropertyFormSubmit - floorplanEmbedScript:", formData.floorplanEmbedScript);
    
    if (!validatePropertyData(formData)) {
      return false;
    }
    
    // Prepare data for submission using our utility functions
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas);
    const floorplansForSubmission = prepareFloorplansForFormSubmission(formData.floorplans);
    const featuresJson = preparePropertiesForJsonField(formData.features);
    const nearby_placesJson = preparePropertiesForJsonField(formData.nearby_places);
    
    console.log("usePropertyFormSubmit - Form submission - areas:", areasForSubmission);
    console.log("usePropertyFormSubmit - Form submission - floorplans:", floorplansForSubmission);
    console.log("usePropertyFormSubmit - Form submission - features:", featuresJson);
    
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
      object_id: formData.object_id,
      agent_id: formData.agent_id,
      template_id: formData.template_id,
      virtualTourUrl: formData.virtualTourUrl,
      youtubeUrl: formData.youtubeUrl,
      notes: formData.notes,
      // Make sure floorplanEmbedScript is explicitly included
      floorplanEmbedScript: formData.floorplanEmbedScript || ""
    };
    
    console.log("usePropertyFormSubmit - Final submit data:", submitData);
    console.log("usePropertyFormSubmit - Final features data:", submitData.features);
    
    let success = false;
    if (formData.id) {
      success = await updateProperty(formData.id, submitData);
    } else {
      success = await createProperty(submitData);
      // Only redirect to home page after creating a new property if shouldRedirect is true
      if (success && shouldRedirect) {
        navigate('/');
      }
    }
    
    console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
    return success;
  };

  return { handleSubmit };
}
