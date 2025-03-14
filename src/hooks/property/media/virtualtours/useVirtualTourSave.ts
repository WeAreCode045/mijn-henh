
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for handling saving virtual tour URL
 */
export function useVirtualTourSave(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Save virtual tour URL
  const handleVirtualTourSave = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use virtualTourUrl to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ virtualTourUrl: url })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        virtualTourUrl: url
      }));
      
      // Call handler if provided
      if (handlers?.handleVirtualTourUpdate) handlers.handleVirtualTourUpdate(url);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Virtual tour URL saved");
    } catch (error) {
      console.error("Error saving virtual tour URL:", error);
      toast.error("Failed to save virtual tour URL");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleVirtualTourSave };
}
