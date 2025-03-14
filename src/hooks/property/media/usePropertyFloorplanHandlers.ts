
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles operations related to property floorplan embed scripts
 */
export function usePropertyFloorplanHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Save floorplan embed script
  const handleFloorplanEmbedScriptSave = async (script: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use floorplanEmbedScript to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ floorplanEmbedScript: script })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplanEmbedScript: script
      }));
      
      // Call handler if provided
      if (handlers?.handleFloorplanEmbedScriptUpdate) handlers.handleFloorplanEmbedScriptUpdate(script);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Floorplan embed script saved");
    } catch (error) {
      console.error("Error saving floorplan embed script:", error);
      toast.error("Failed to save floorplan embed script");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleFloorplanEmbedScriptSave
  };
}
