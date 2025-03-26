
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider"; // Fix the import path

/**
 * Hook for logging property edits
 * @returns Functions to log property edits
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
        field_name: action, // Use field_name instead of action
        new_value: details   // Use new_value for details
      });
    } catch (error) {
      console.error("Error logging property edit:", error);
    }
  }, [user]);
  
  /**
   * Log changes between two property states
   * 
   * @param propertyId - ID of the property
   * @param oldData - Previous property data
   * @param newData - New property data
   */
  const logPropertyChanges = useCallback(async (
    propertyId: string,
    oldData: Record<string, any>,
    newData: Record<string, any>
  ) => {
    try {
      if (!user || !propertyId) return;
      
      // Find changed fields
      const changedFields: Record<string, { old: any; new: any }> = {};
      
      Object.keys(newData).forEach(key => {
        // Skip functions and objects for simple comparison
        if (
          typeof newData[key] !== 'function' && 
          typeof oldData?.[key] !== 'function' &&
          typeof newData[key] !== 'object' &&
          JSON.stringify(newData[key]) !== JSON.stringify(oldData?.[key])
        ) {
          changedFields[key] = {
            old: oldData?.[key],
            new: newData[key]
          };
        }
      });
      
      // Log each changed field
      for (const [field, values] of Object.entries(changedFields)) {
        await supabase.from('property_edit_logs').insert({
          property_id: propertyId,
          user_id: user.id,
          field_name: field,
          old_value: String(values.old),
          new_value: String(values.new)
        });
      }
    } catch (error) {
      console.error("Error logging property changes:", error);
    }
  }, [user]);
  
  // Alias for backwards compatibility
  const logPropertyChange = logPropertyEdit;
  
  return {
    logPropertyEdit,
    logPropertyChanges,
    logPropertyChange
  };
}
