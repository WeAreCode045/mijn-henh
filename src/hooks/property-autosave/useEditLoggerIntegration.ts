
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useEditLoggerIntegration() {
  const { logPropertyChanges } = usePropertyEditLogger();

  const logFieldChange = async (
    propertyId: string, 
    oldValue: { [key: string]: any } | null,
    newValue: { [key: string]: any }
  ) => {
    if (oldValue && propertyId) {
      return await logPropertyChanges(propertyId, oldValue, newValue);
    }
  };

  const logDataChanges = async (
    propertyId: string,
    oldData: any,
    newData: any
  ) => {
    if (oldData && propertyId) {
      return await logPropertyChanges(propertyId, oldData, newData);
    }
  };

  return {
    logFieldChange,
    logDataChanges
  };
}
