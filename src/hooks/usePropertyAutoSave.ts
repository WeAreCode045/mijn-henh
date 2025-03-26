
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyAutoSave(propertyId: string | undefined) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveData = async (data: Partial<PropertyFormData>) => {
    if (!propertyId) return;
    
    setIsSaving(true);
    
    try {
      // Clean up data to ensure propertyImages are properly formatted
      const cleanData: any = { ...data };
      
      // Remove complex objects that shouldn't be directly saved
      if (cleanData.areaPhotos) delete cleanData.areaPhotos;
      if (cleanData.gridImages) delete cleanData.gridImages;
      
      // Update the property
      const { error } = await supabase
        .from("properties")
        .update(cleanData)
        .eq("id", propertyId);
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Error autosaving property data:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveData,
    isSaving
  };
}
