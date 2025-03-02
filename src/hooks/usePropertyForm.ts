
import { usePropertyFetch } from "./property-form/usePropertyFetch";
import { initialFormData } from "./property-form/initialFormData";
import { useState, useEffect } from "react";
import type { PropertyFormData } from "@/types/property";

export function usePropertyForm(id: string | undefined, onSubmit?: (data: PropertyFormData) => void) {
  // Use the separated fetch hook for loading property data
  const { formData: fetchedFormData, setFormData, isLoading: isFetching } = usePropertyFetch(id);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormDataState] = useState<PropertyFormData | null>(null);

  // Handle the case when creating a new property (no id)
  useEffect(() => {
    if (!id) {
      // For new property, use initial form data
      console.log("usePropertyForm: No ID provided, creating new property with initial data");
      setFormDataState(initialFormData);
      setIsLoading(false);
    } else if (!isFetching && fetchedFormData) {
      // For existing property, use fetched data
      console.log("usePropertyForm: Using fetched property data", fetchedFormData);
      setFormDataState(fetchedFormData);
      setIsLoading(false);
    } else if (!isFetching && !fetchedFormData && id !== 'undefined' && id !== 'null') {
      // Handle case when no data is found but ID is valid
      console.log("usePropertyForm: No data found for ID, using initial data", id);
      setFormDataState({...initialFormData, id});
      setIsLoading(false);
    }
  }, [id, isFetching, fetchedFormData]);

  // Use a wrapper for setFormData to update both states
  const updateFormData = (newFormData: PropertyFormData) => {
    setFormDataState(newFormData);
    setFormData(newFormData);
  };

  return {
    formData,
    setFormData: updateFormData,
    isLoading
  };
}
