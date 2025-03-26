
import { useState, useEffect, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyAutoSave(propertyId: string | undefined) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const saveData = useCallback(async (data: Partial<PropertyFormData>) => {
    if (!propertyId) return;
    
    try {
      setIsSaving(true);
      
      // Remove any complex objects that can't be directly saved to the database
      const cleanedData = { ...data };
      
      // Convert any arrays of objects to simple arrays if needed
      if (Array.isArray(cleanedData.areaPhotos)) {
        const stringArray = cleanedData.areaPhotos.map(photo => 
          typeof photo === 'string' ? photo : photo.url
        );
        cleanedData.areaPhotos = stringArray;
      }
      
      const { error } = await supabase
        .from('properties')
        .update(cleanedData)
        .eq('id', propertyId);
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error auto-saving property data:", error);
      toast({
        title: "Auto-save error",
        description: "Failed to save your changes automatically.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [propertyId, toast]);
  
  return { saveData, isSaving };
}
