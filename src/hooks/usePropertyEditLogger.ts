
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook for logging property edits
 * @returns A function to log property edits
 */
export function usePropertyEditLogger() {
  const { user } = useAuth();
  
  /**
   * Log a property edit to the database
   * 
   * @param propertyId - ID of the property
   * @param action - Type of edit action
   * @param details - Additional details about the edit
   */
  const logPropertyEdit = useCallback(async (
    propertyId: string,
    action: string,
    details: string
  ) => {
    try {
      if (!user) return;
      
      await supabase.from('property_edit_logs').insert({
        property_id: propertyId,
        user_id: user.id,
        action,
        details,
      });
    } catch (error) {
      console.error("Error logging property edit:", error);
    }
  }, [user]);
  
  return logPropertyEdit;
}
