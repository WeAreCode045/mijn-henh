
import { useState, useCallback, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { debounce } from "lodash";

export function usePropertyFormState(
  formState: PropertyFormData, 
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { autosaveField, setPendingChanges } = usePropertyAutoSave();
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Type-safe field change handler with debounce
  const handleFieldChange = useCallback(<K extends keyof PropertyFormData>(
    field: K, 
    value: PropertyFormData[K]
  ) => {
    // Update local state immediately
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
    
    // Mark that there are pending changes
    setPendingChanges(true);
    
    // Set a debounce timer to save changes to database
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Only autosave if we have an ID (existing property)
    if (formState.id) {
      const newTimeout = setTimeout(() => {
        // Save only the changed field to database
        autosaveField(formState.id, field, value)
          .then(success => {
            if (success) {
              console.log(`Field ${String(field)} autosaved successfully`);
            }
          })
          .catch(error => {
            console.error(`Error autosaving field ${String(field)}:`, error);
          });
      }, 2000); // 2-second debounce
      
      setSaveTimeout(newTimeout);
    }
  }, [formState, setFormState, autosaveField, setPendingChanges, saveTimeout]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  return {
    formState,
    setFormState,
    handleFieldChange,
    onFieldChange: handleFieldChange // For backward compatibility
  };
}
