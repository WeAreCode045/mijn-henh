
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function usePropertyEditLogger() {
  const [isLogging, setIsLogging] = useState(false);
  const { user } = useAuth();

  const logPropertyChange = async (
    propertyId: string,
    editType: string,
    description: string
  ) => {
    if (!propertyId) return;
    
    try {
      setIsLogging(true);
      
      const { error } = await supabase
        .from('property_edit_logs')
        .insert({
          property_id: propertyId,
          edit_type: editType,
          description: description,
          user_id: user?.id || null
        });
        
      if (error) throw error;
      
      console.log(`Property edit logged: ${editType} - ${description}`);
    } catch (error) {
      console.error("Error logging property edit:", error);
    } finally {
      setIsLogging(false);
    }
  };

  // Alias for logPropertyChange for backward compatibility
  const logPropertyEdit = logPropertyChange;

  return {
    logPropertyChange,
    logPropertyEdit,
    isLogging
  };
}
