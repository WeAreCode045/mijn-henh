
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function usePropertyEditLogger() {
  const [isLogging, setIsLogging] = useState(false);
  const { user } = useAuth();

  const logPropertyChange = async (propertyId: string, fieldName: string, newValue: string) => {
    if (!user) return;

    setIsLogging(true);

    try {
      // Get current timestamp
      const timestamp = new Date().toISOString();

      // Get user name from metadata or fallback to email
      const userName = user.email || 'Unknown User';

      // Insert log entry
      const { error } = await supabase.from("property_edit_logs").insert({
        property_id: propertyId,
        user_id: user.id,
        user_name: userName,
        field_name: fieldName,
        new_value: newValue,
        created_at: timestamp
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging property change:", error);
    } finally {
      setIsLogging(false);
    }
  };

  return {
    logPropertyChange,
    isLogging
  };
}
