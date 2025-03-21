
import { supabase } from "@/integrations/supabase/client";

export function usePropertyDatabaseStorage() {
  // Insert or update property
  const storeProperty = async (propertyData: any, existingId: string | null, operation: 'insert' | 'update') => {
    try {
      if (operation === 'update' && existingId) {
        console.log(`Updating property ${existingId}`);
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', existingId);
        
        if (error) throw error;
        return existingId;
      } else {
        console.log(`Inserting new property: ${propertyData.title}`);
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select('id')
          .single();
        
        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error(`Error ${operation === 'update' ? 'updating' : 'inserting'} property:`, error);
      return null;
    }
  };

  return {
    storeProperty
  };
}
