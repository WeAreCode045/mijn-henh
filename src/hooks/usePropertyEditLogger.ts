
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function usePropertyEditLogger() {
  const { user, profile } = useAuth();
  
  const logPropertyChange = async (
    propertyId: string,
    fieldName: string,
    oldValue: string | null | undefined,
    newValue: string | null | undefined
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
        key === 'updated_at' ||
        key === 'images' ||
        key === 'areas' ||
        key === 'nearby_places' ||
        key === 'nearby_cities' ||
        key === 'coverImages' ||
        key === 'gridImages' ||
        key === 'areaPhotos' ||
        key === 'floorplans' ||
        key === 'featuredImages'
      ) {
        continue;
      }
      
      // Handle different types of values
      if (typeof oldData[key] === 'object' || typeof newData[key] === 'object') {
        // Skip complex objects
        continue;
      }
      
      // Check if value changed
      if (oldData[key] !== newData[key]) {
        await logPropertyChange(
          propertyId,
          key,
          oldData[key]?.toString(),
          newData[key]?.toString()
        );
      }
    }
  };
  
  return { logPropertyChange, logPropertyChanges };
}
