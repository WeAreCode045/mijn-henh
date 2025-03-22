
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { prepareFieldForSubmission } from "./preparePropertyData";

export function usePropertyFieldAutosave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChanges } = usePropertyEditLogger();

  const autosaveField = async <K extends keyof PropertyFormData>(
    propertyId: string,
    field: K,
    value: PropertyFormData[K]
  ): Promise<boolean> => {
    if (!propertyId) return false;
    
    try {
      setIsSaving(true);
      
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      // Prepare the field value for database submission
      const fieldValue = prepareFieldForSubmission(field, value);
      
      console.log(`Auto-saving field ${String(field)}:`, fieldValue);

      // Create an update object with just the single field
      const updateData = { [field]: fieldValue };

      // Don't include updated_at to let Supabase update it automatically
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select(); // Add select to retrieve the updated data including the timestamp

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      console.log('Auto-save successful, new timestamp:', updatedData?.[0]?.updated_at);
      
      // Log only the specific field change that occurred
      if (currentPropertyData) {
        const oldValueObj = { [field]: currentPropertyData[field as string] };
        const newValueObj = { [field]: fieldValue };
        await logPropertyChanges(propertyId, oldValueObj, newValueObj);
      }
      
      // Return actual server timestamp if available
      const timestamp = updatedData?.[0]?.updated_at 
        ? new Date(updatedData[0].updated_at) 
        : new Date();
      
      return true;
    } catch (error: any) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Auto-save Failed",
        description: error.message || "An error occurred during auto-save",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    autosaveField,
    isSaving
  };
}
