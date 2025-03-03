
import { usePropertyFetch } from "./property-form/usePropertyFetch";
import { initialFormData } from "./property-form/initialFormData";
import { useState, useEffect } from "react";
import type { PropertyFormData } from "@/types/property";

export function usePropertyForm(id: string | undefined, onSubmit?: (data: PropertyFormData) => void) {
  // Use the separated fetch hook for loading property data
  const { formData: fetchedFormData, setFormData: setFetchedFormData, isLoading: isFetching } = usePropertyFetch(id);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormDataState] = useState<PropertyFormData | null>(null);

  // Handle the case when creating a new property (no id)
  useEffect(() => {
    // Log the current state for debugging
    console.log("usePropertyForm - ID:", id);
    console.log("usePropertyForm - isFetching:", isFetching);
    console.log("usePropertyForm - fetchedFormData available:", fetchedFormData ? "yes" : "no");
    
    if (!id) {
      // For new property, use initial form data
      console.log("usePropertyForm: No ID provided, creating new property with initial data");
      setFormDataState(initialFormData);
      setIsLoading(false);
    } else if (!isFetching) {
      if (fetchedFormData) {
        // For existing property, use fetched data
        console.log("usePropertyForm: Using fetched property data", fetchedFormData);
        setFormDataState(fetchedFormData);
        setIsLoading(false);
      } else if (id !== 'undefined' && id !== 'null') {
        // Handle case when no data is found but ID is valid
        console.log("usePropertyForm: No data found for ID, using initial data with ID", id);
        // Use initial data but set the ID
        const defaultData = {
          ...initialFormData,
          id: id,
          // Ensure empty arrays are initialized
          features: [],
          floorplans: [],
          areas: [],
          images: [],
          technicalItems: []
        };
        
        setFormDataState(defaultData);
        setIsLoading(false);
      }
    }
  }, [id, isFetching, fetchedFormData]);

  // Use a wrapper for setFormData to update both states
  const updateFormData = (newFormData: PropertyFormData) => {
    console.log("Setting form data:", newFormData);
    setFormDataState(newFormData);
    setFetchedFormData(newFormData);
  };

  return {
    formData,
    setFormData: updateFormData,
    isLoading
  };
}
