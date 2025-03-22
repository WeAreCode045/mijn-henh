
import { useState, useEffect, useRef } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFieldAutosave } from "./usePropertyFieldAutosave";
import { usePropertyDataAutosave } from "./usePropertyDataAutosave";

export function usePropertyAutoSave() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { autosaveField, isSaving: isFieldSaving } = usePropertyFieldAutosave();
  const { autosaveData, isSaving: isDataSaving } = usePropertyDataAutosave();
  
  // Combined isSaving state from both hooks
  const isSaving = isFieldSaving || isDataSaving;

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    autosaveData,
    autosaveField,
    isSaving,
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
