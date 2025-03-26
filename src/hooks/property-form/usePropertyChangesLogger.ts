
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertyChangesLogger(propertyId: string | undefined) {
  const { logPropertyChange, isLogging } = usePropertyEditLogger();
  
  const logChanges = async (field: string, value: any) => {
    if (!propertyId) return;
    
    await logPropertyChange(
      propertyId,
      field,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    );
  };
  
  return {
    logChanges,
    isLogging
  };
}
