
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function usePropertyChangesLogger(propertyId: string | undefined) {
  const { user } = useAuth();

  const logChanges = useCallback(async (action: string, details: string) => {
    if (!user || !propertyId) return;

    try {
      const { error } = await supabase
        .from("property_edit_logs")
        .insert({
          property_id: propertyId,
          user_id: user.id,
          user_name: user.email || 'Unknown User',
          field_name: action,
          new_value: details,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging property changes:", error);
    }
  }, [user, propertyId]);

  return { logChanges };
}
