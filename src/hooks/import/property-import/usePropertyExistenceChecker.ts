
import { supabase } from "@/integrations/supabase/client";

export function usePropertyExistenceChecker() {
  // Check if property exists by object_id
  const checkExistingProperty = async (objectId: string, title?: string) => {
    try {
      // First try to find by object_id
      const { data: existingPropertyByObjectId } = await supabase
        .from('properties')
        .select('id, title')
        .eq('object_id', objectId)
        .maybeSingle();
      
      if (existingPropertyByObjectId) {
        return existingPropertyByObjectId;
      }
      
      // If not found and we have a title, try to find by title as fallback
      if (title) {
        const { data: existingPropertyByTitle } = await supabase
          .from('properties')
          .select('id, title')
          .eq('title', title)
          .maybeSingle();
        
        if (existingPropertyByTitle) {
          return existingPropertyByTitle;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error checking existing property:", error);
      return null;
    }
  };

  return {
    checkExistingProperty
  };
}
