
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useEditLoggerIntegration() {
  const { logPropertyChange, isLogging } = usePropertyEditLogger();
  
  const logChanges = async (
    propertyId: string,
    editType: string,
    description: string
  ) => {
    if (!propertyId) return;
    
    await logPropertyChange(propertyId, editType, description);
  };
  
  return {
    logChanges,
    isLogging
  };
}
