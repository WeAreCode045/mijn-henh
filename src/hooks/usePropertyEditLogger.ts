
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";

export function usePropertyEditLogger() {
  const { user, profile } = useAuth();
  
  const logPropertyChange = async (
    propertyId: string,
    fieldName: string,
    oldValue: any,
    newValue: any
  ) => {
    // Don't log if values are the same or if either propertyId or fieldName is missing
    if (!propertyId || !fieldName || oldValue === newValue) {
      return;
    }
    
    // Format values as strings
    const oldValueStr = oldValue !== null && oldValue !== undefined ? String(oldValue) : '';
    const newValueStr = newValue !== null && newValue !== undefined ? String(newValue) : '';
    
    try {
      const { error } = await supabase
        .from('property_edit_logs')
        .insert({
          property_id: propertyId,
          user_id: user?.id || '',
          user_name: profile?.full_name || user?.email || 'Unknown user',
          field_name: fieldName,
          old_value: oldValueStr,
          new_value: newValueStr
        });
        
      if (error) {
        console.error("Error logging property change:", error);
      }
    } catch (error) {
      console.error("Failed to log property change:", error);
    }
  };
  
  // Compare two property objects and log all changes
  const logPropertyChanges = async (
    propertyId: string, 
    oldData: any, 
    newData: any
  ) => {
    if (!propertyId) return;
    
    console.log("Comparing property changes for logging:", { 
      propertyId,
      oldDataKeys: Object.keys(oldData),
      newDataKeys: Object.keys(newData)
    });
    
    // Get all keys from both objects
    const allKeys = new Set([
      ...Object.keys(oldData),
      ...Object.keys(newData)
    ]);
    
    for (const key of allKeys) {
      // Skip complex objects, arrays, and unchangeable fields
      if (
        key === 'id' || 
        key === 'created_at' || 
        key === 'updated_at'
      ) {
        continue;
      }
      
      // Skip if both values are undefined or null
      if ((oldData[key] === undefined || oldData[key] === null) && 
          (newData[key] === undefined || newData[key] === null)) {
        continue;
      }
      
      // Handle different types of values
      if (typeof oldData[key] === 'object' || typeof newData[key] === 'object') {
        // For objects like metadata, stringify them for comparison
        const oldJson = JSON.stringify(oldData[key]);
        const newJson = JSON.stringify(newData[key]);
        
        if (oldJson !== newJson) {
          await logPropertyChange(
            propertyId,
            key,
            oldJson,
            newJson
          );
        }
        continue;
      }
      
      // Check if value changed
      if (oldData[key] !== newData[key]) {
        console.log(`Logging change for field: ${key}`, {
          old: oldData[key],
          new: newData[key]
        });
        
        await logPropertyChange(
          propertyId,
          key,
          oldData[key],
          newData[key]
        );
      }
    }
  };
  
  return { logPropertyChange, logPropertyChanges };
}
