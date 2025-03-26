
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { preparePropertiesForJsonField } from "../property-form/preparePropertyData";

export function useAutoSaveField() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
      let fieldValue = value;
      
      // Special handling for specific field types
      if (field === 'features' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      } else if (field === 'areas' && Array.isArray(value)) {
        // Handle areas specially
        fieldValue = value.map(area => ({
          id: area.id,
          name: area.name || '',
          title: area.title || '',
          description: area.description || '',
          size: area.size || '',
          columns: area.columns || 2,
          imageIds: area.imageIds || [],
          images: area.images || [],
          areaImages: area.areaImages || []
        })) as any;
      } else if (field === 'nearby_places' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      } else if (field === 'nearby_cities' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      }
      
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
      
      // Return change tracking info for the caller to handle
      const success = true;
      const changeData = {
        oldValue: currentPropertyData ? { [field]: currentPropertyData[field as string] } : null,
        newValue: { [field]: fieldValue },
        updatedAt: updatedData?.[0]?.updated_at,
      };
      
      return success;
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
