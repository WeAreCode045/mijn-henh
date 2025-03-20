
import { PropertyFormData } from "@/types/property";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyChangesLogger() {
  const { logPropertyChanges } = usePropertyEditLogger();
  
  const fetchCurrentPropertyData = async (propertyId: string) => {
    const { data: currentPropertyData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
      
    console.log("Current property data retrieved for change comparison:", currentPropertyData);
    return currentPropertyData;
  };
  
  const logChanges = async (propertyId: string, currentData: any, newData: any) => {
    if (currentData) {
      console.log("Logging changes between:", {
        oldData: currentData,
        newData: newData
      });
      await logPropertyChanges(propertyId, currentData, newData);
    }
  };
  
  return {
    fetchCurrentPropertyData,
    logChanges
  };
}
