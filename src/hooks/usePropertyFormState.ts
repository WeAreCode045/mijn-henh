import { useState, useCallback, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyAutoSave } from "@/hooks/property-autosave";

export function usePropertyFormState(
  formState: PropertyFormData, 
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { autosaveField, setPendingChanges } = usePropertyAutoSave();
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [changedField, setChangedField] = useState<{field: keyof PropertyFormData, value: any} | null>(null);
  
  // Type-safe field change handler
  const handleFieldChange = useCallback(<K extends keyof PropertyFormData>(
    field: K, 
    value: PropertyFormData[K]
  ) => {
    // Update local state immediately
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
    
    // Track which field changed and its new value
    setChangedField({field, value});
    
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
              // Reset the changed field tracking after successful save
              setChangedField(null);
            }
          })
          .catch(error => {
            console.error(`Error autosaving field ${String(field)}:`, error);
          });
      }, 2000); // 2-second debounce
      
      setSaveTimeout(newTimeout);
    }
  }, [formState.id, autosaveField, setPendingChanges, saveTimeout]);
  
  // Save the last changed field when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (changedField && formState.id) {
        // Attempt to save the last changed field without waiting for the timeout
        autosaveField(formState.id, changedField.field, changedField.value)
          .then(success => {
            if (success) {
              console.log(`Field ${String(changedField.field)} saved on page leave`);
            }
          })
          .catch(error => {
            console.error(`Error saving field on page leave:`, error);
          });
      }
    };

    // Add beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up timeout and event listener on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Save any unsaved changes when component unmounts
      if (changedField && formState.id) {
        autosaveField(formState.id, changedField.field, changedField.value)
          .then(success => {
            if (success) console.log(`Field ${String(changedField.field)} saved on unmount`);
          })
          .catch(error => {
            console.error(`Error saving field on unmount:`, error);
          });
      }
    };
  }, [saveTimeout, changedField, formState.id, autosaveField]);
  
  return {
    formState,
    setFormState,
    handleFieldChange,
    onFieldChange: handleFieldChange // For backward compatibility
  };
}
