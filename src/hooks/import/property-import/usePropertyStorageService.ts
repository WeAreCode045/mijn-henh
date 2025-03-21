
import { supabase } from "@/integrations/supabase/client";

export function usePropertyStorageService() {
  // Check if a property already exists by object_id or title
  const checkExistingProperty = async (objectId: string, title?: string) => {
    // First, check if property already exists by object_id
    let { data: existingProperty } = await supabase
      .from('properties')
      .select('id')
      .eq('object_id', objectId)
      .maybeSingle();
      
    // If not found by object_id, try title as fallback
    if (!existingProperty && title) {
      const { data: propertyByTitle } = await supabase
        .from('properties')
        .select('id')
        .eq('title', title)
        .maybeSingle();
        
      if (propertyByTitle) {
        existingProperty = propertyByTitle;
      }
    }
    
    return existingProperty;
  };
  
  // Store (insert or update) a property
  const storeProperty = async (
    propertyData: Record<string, any>, 
    existingId: string | null,
    mode: 'insert' | 'update'
  ) => {
    try {
      if (mode === 'update' && existingId) {
        // Update existing property
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', existingId);

        if (updateError) {
          console.error("Error updating property:", updateError);
          return null;
        }
        
        return existingId;
      } else {
        // Insert new property
        const { data: newProperty, error: insertError } = await supabase
          .from('properties')
          .insert(propertyData)
          .select('id')
          .single();

        if (insertError || !newProperty) {
          console.error("Error inserting property:", insertError);
          return null;
        }
        
        return newProperty.id;
      }
    } catch (error) {
      console.error("Error storing property:", error);
      return null;
    }
  };
  
  return {
    checkExistingProperty,
    storeProperty
  };
}
