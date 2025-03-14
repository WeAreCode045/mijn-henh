
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for handling saving YouTube URL
 */
export function useYoutubeUrlSave(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleYoutubeUrlUpdate?: (url: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Save YouTube URL
  const handleYoutubeUrlSave = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use youtubeUrl to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ youtubeUrl: url })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        youtubeUrl: url
      }));
      
      // Call handler if provided
      if (handlers?.handleYoutubeUrlUpdate) handlers.handleYoutubeUrlUpdate(url);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("YouTube URL saved");
    } catch (error) {
      console.error("Error saving YouTube URL:", error);
      toast.error("Failed to save YouTube URL");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleYoutubeUrlSave };
}
