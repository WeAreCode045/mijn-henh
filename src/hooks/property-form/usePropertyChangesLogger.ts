
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertyChangesLogger(propertyId: string | undefined) {
  const { logPropertyChange, isLogging } = usePropertyEditLogger();
  
  const logChanges = async (field: string, value: any) => {
    if (!propertyId) return;
    
    await logPropertyChange(
      propertyId,
      "field_update",
      `Updated ${field} to ${JSON.stringify(value)}`
    );
  };
  
  return {
    logChanges,
    isLogging
  };
}
