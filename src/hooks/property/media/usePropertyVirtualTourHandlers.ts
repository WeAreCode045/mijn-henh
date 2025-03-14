
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles operations related to property virtual tours
 */
export function usePropertyVirtualTourHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
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

  return {
    handleVirtualTourSave,
    handleYoutubeUrlSave
  };
}
