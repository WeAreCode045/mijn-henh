
import { useNavigate } from "react-router-dom";
import { PropertyFormData, PropertySubmitData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";
import { usePropertyUpdate } from "@/hooks/property-form/usePropertyUpdate";

export function usePropertyFormSubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateProperty } = usePropertyUpdate();

  /**
   * Handles the property form submission
   * @param e Form submission event
   * @param formData The form data to submit
   * @param redirectAfterSave Whether to redirect after saving
   * @returns Promise that resolves to true if successful
   */
  const handleSubmit = async (
    e: React.FormEvent,
    formData: PropertyFormData,
    redirectAfterSave: boolean = true
  ): Promise<boolean> => {
    if (e && e.preventDefault) e.preventDefault();
    
    console.log("handleSubmit called with formData:", formData);
    console.log("redirectAfterSave:", redirectAfterSave);

    try {
      // Convert form data to submit format
      const submitData: PropertySubmitData = {
        id: formData.id, // This line is now valid since we added id to PropertySubmitData
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
        shortDescription: formData.shortDescription || '',
        location_description: formData.location_description || '',
        features: JSON.stringify(formData.features || []),
        areas: formData.areas || [],
        nearby_places: JSON.stringify(formData.nearby_places || []),
        nearby_cities: JSON.stringify(formData.nearby_cities || []),
        latitude: formData.latitude,
        longitude: formData.longitude,
        map_image: formData.map_image,
        object_id: formData.object_id,
        agent_id: formData.agent_id,
        template_id: formData.template_id,
        virtualTourUrl: formData.virtualTourUrl || '',
        youtubeUrl: formData.youtubeUrl || '',
        floorplanEmbedScript: formData.floorplanEmbedScript || '',
        status: formData.status || 'Draft',
        propertyType: formData.propertyType || '',
        metadata: formData.metadata || { status: formData.status || 'Draft' },
        images: Array.isArray(formData.images) 
          ? formData.images.map(img => typeof img === 'string' ? img : img.url) 
          : []
      };

      console.log("Prepared submitData:", submitData);

      // Update property in the database
      if (formData.id) {
        console.log("Updating existing property with ID:", formData.id);
        const updateSuccess = await updateProperty(formData.id, submitData);
        
        if (!updateSuccess) {
          throw new Error("Failed to update property");
        }
        
        console.log("Property updated successfully");
        
        if (redirectAfterSave) {
          console.log("Redirecting to dashboard");
          navigate("/dashboard");
        }
        
        return true;
      } else {
        throw new Error("Property ID is missing");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
}
