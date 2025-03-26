import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyChangesLogger } from "@/hooks/property-form/usePropertyChangesLogger";

export function usePropertyAutoSave(id: string, initialData: PropertyFormData) {
  const [formData, setFormData] = useState<PropertyFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedFormData = useDebounce(formData, 500);
  const { toast } = useToast();
  const { fetchCurrentPropertyData, logChanges } = usePropertyChangesLogger();
  
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  
  const saveProperty = useCallback(async (data: Partial<PropertyFormData>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Property saved successfully!",
      });
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [id, toast]);
  
  useEffect(() => {
    if (id && Object.keys(debouncedFormData).length > 0) {
      const autoSave = async () => {
        try {
          setIsSaving(true);
          
          // Fetch current property data before saving
          const currentData = await fetchCurrentPropertyData(id);
          
          // Save the debounced form data
          await saveProperty(debouncedFormData);
          
          // Log the changes
          if (currentData) {
            await logChanges(id, currentData, debouncedFormData);
          }
        } catch (error) {
          console.error("Error during auto-saving:", error);
        } finally {
          setIsSaving(false);
        }
      };
      
      autoSave();
    }
  }, [debouncedFormData, id, saveProperty, fetchCurrentPropertyData, logChanges]);
  
  const updateFormData = (newData: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };
  
  return {
    formData,
    updateFormData,
    isSaving
  };
}
