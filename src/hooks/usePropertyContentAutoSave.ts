
import { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyContentAutoSave(
  formData: PropertyFormData,
  pendingChanges: boolean, 
  setPendingChanges: (pending: boolean) => void
) {
  const { autosaveData, scheduleAutosave, lastSaved, setLastSaved } = usePropertyAutoSave();
  const { toast } = useToast();
  
  // Watch for changes to automatically save
  useEffect(() => {
    if (pendingChanges && formData.id) {
      console.log("Changes detected, scheduling autosave");
      scheduleAutosave(formData);
    }
  }, [formData, pendingChanges, scheduleAutosave]);
  
  // Manual save function
  const saveChanges = async () => {
    if (formData.id && pendingChanges) {
      console.log("Manually saving form data...");
      
      try {
        await autosaveData(formData);
        setPendingChanges(false);
      } catch (error) {
        console.error("Manual save failed:", error);
        toast({
          title: "Save failed",
          description: "Your changes couldn't be saved",
          variant: "destructive",
        });
      }
    }
  };

  return {
    lastSaved,
    setLastSaved,
    saveChanges
  };
}
