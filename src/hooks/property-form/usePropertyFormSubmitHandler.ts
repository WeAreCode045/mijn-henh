
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyChangesLogger } from "./usePropertyChangesLogger";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFormSubmitHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logChanges } = usePropertyChangesLogger(undefined);

  const handleSubmit = async (
    e: React.FormEvent,
    formData: PropertyFormData,
    shouldRedirect: boolean = true
  ) => {
    e.preventDefault();
    
    if (!formData.id) {
      console.error("Property ID is missing");
      return false;
    }
    
    try {
      // Format features as JSON string
      const featuresJson = JSON.stringify(formData.features || []);
      
      // Update basic property data
      const { error } = await supabase
        .from("properties")
        .update({
          title: formData.title,
          description: formData.description,
          address: formData.address,
          price: formData.price,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          sqft: formData.sqft,
          propertyType: formData.propertyType,
          status: formData.status,
          features: featuresJson,
          energyLabel: formData.energyLabel,
          buildYear: formData.buildYear,
          livingArea: formData.livingArea,
          garages: formData.garages,
          hasGarden: formData.hasGarden
        })
        .eq("id", formData.id);
      
      if (error) throw error;
      
      // Log changes
      await logChanges("form_submission", JSON.stringify({submitted: true}));
      
      // Handle navigation or success message
      if (shouldRedirect) {
        navigate("/properties");
      }
      
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting property form:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
}
