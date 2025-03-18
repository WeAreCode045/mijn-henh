
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { fetchPropertyDataFromApi } from "./operations/propertyFetchOperations";
import { savePropertyDataToApi } from "./operations/propertySaveOperations";

export function usePropertyContent(propertyId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Function to refresh property data from API
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPropertyDataFromApi(propertyId);
      setIsLoading(false);
      return data;
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
      return null;
    }
  };
  
  // Function to save property data to API
  const savePropertyData = async (data: PropertyFormData) => {
    try {
      setIsSaving(true);
      setError(null);
      await savePropertyDataToApi(propertyId, data);
      setLastSaved(new Date());
      setPendingChanges(false);
      setIsSaving(false);
      return true;
    } catch (err: any) {
      setError(err);
      setIsSaving(false);
      return false;
    }
  };
  
  // Function to determine if property data should be fetched
  const shouldFetchProperty = () => {
    return !!propertyId && propertyId !== "new" && propertyId !== "undefined";
  };
  
  return {
    refreshData,
    savePropertyData,
    shouldFetchProperty,
    isLoading,
    isSaving,
    error,
    pendingChanges,
    setPendingChanges,
    lastSaved
  };
}
