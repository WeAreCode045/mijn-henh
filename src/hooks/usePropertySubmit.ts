
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertySubmitData } from "@/types/property";
import { usePropertyDataPreparer } from "./property-form/usePropertyDataPreparer";

export function usePropertySubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { prepareSubmitData } = usePropertyDataPreparer();

  const submitProperty = async (formData: PropertyFormData): Promise<string | null> => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submitData = prepareSubmitData(formData);
      
      // Add JSON serialization for complex fields
      const dataForDb = {
        ...submitData,
        features: JSON.stringify(submitData.features),
        areas: JSON.stringify(submitData.areas),
        nearby_places: JSON.stringify(submitData.nearby_places),
        nearby_cities: JSON.stringify(submitData.nearby_cities),
        // Serialize generalInfo field if it exists
        generalInfo: submitData.generalInfo ? 
          (typeof submitData.generalInfo === 'string' ? 
            submitData.generalInfo : 
            JSON.stringify(submitData.generalInfo)
          ) : null
      };
      
      const { data, error } = await supabase
        .from('properties')
        .upsert(dataForDb, { onConflict: 'id' })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
      
      return data?.id || null;
    } catch (error: any) {
      console.error("Error saving property:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { submitProperty, isSubmitting };
}
