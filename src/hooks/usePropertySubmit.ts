import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertySubmitData } from "@/types/property";
import { usePropertyDataPreparer } from "./property-form/usePropertyDataPreparer";
import { Json } from "@/integrations/supabase/types";

export function usePropertySubmit() {
  const { preparePropertyData, processPropertyData } = usePropertyDataPreparer();
  
  const prepareSubmitData = (formData: PropertyFormData): PropertySubmitData => {
    return {
      ...formData,
      propertyType: formData.propertyType || 'residential'
    };
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const submitProperty = async (formData: PropertyFormData): Promise<string | null> => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submitData = prepareSubmitData(formData);
      
      // Add JSON serialization for complex fields
      const dataForDb: Record<string, any> = {
        ...submitData,
        features: JSON.stringify(submitData.features),
        areas: JSON.stringify(submitData.areas),
        nearby_places: submitData.nearby_places ? JSON.stringify(submitData.nearby_places) : null,
        nearby_cities: submitData.nearby_cities ? JSON.stringify(submitData.nearby_cities) : null,
      };
      
      // Process generalInfo field if it exists
      if (submitData.generalInfo) {
        dataForDb.generalInfo = submitData.generalInfo;
      }
      
      // Process floorplans if they exist
      if (submitData.floorplans && submitData.floorplans.length > 0) {
        dataForDb.floorplans = JSON.stringify(submitData.floorplans);
      }
      
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
  
  return {
    preparePropertyData,
    processPropertyData,
    prepareSubmitData,
    submitProperty,
    isSubmitting
  };
}
