
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useEditLoggerIntegration() {
  const { logPropertyChange, isLogging } = usePropertyEditLogger();
  
  const logChanges = async (
    propertyId: string,
    fieldName: string,
    description: string
  ) => {
    if (!propertyId) return;
    
    await logPropertyChange(propertyId, fieldName, description);
  };
  
  return {
    logChanges,
    isLogging
  };
}
