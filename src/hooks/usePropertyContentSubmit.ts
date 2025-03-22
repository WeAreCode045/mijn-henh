
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyAutoSave } from '@/hooks/usePropertyAutoSave';
import { useToast } from "@/components/ui/use-toast";

export function usePropertyContentSubmit(
  formData: PropertyFormData,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void,
  onSubmitCallback?: () => void
) {
  const [isSaving, setIsSaving] = useState(false);
  const { autosaveData } = usePropertyAutoSave();
  const { toast } = useToast();
  
  const onSubmit = useCallback(async () => {
    if (!formData.id) {
      toast({
        title: "Error",
        description: "No property ID found for saving",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    
    try {
      console.log("Saving content tab data...");
      await autosaveData(formData);
      setLastSaved(new Date());
      setPendingChanges(false);
      
      // Call the original onSubmit if provided
      if (onSubmitCallback) {
        onSubmitCallback();
      }
      
      return true;
    } catch (error) {
      console.error("Error saving content tab data:", error);
      toast({
        title: "Error",
        description: "Failed to save property content",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, autosaveData, setLastSaved, setPendingChanges, onSubmitCallback, toast]);

  return { onSubmit, isSaving };
}
