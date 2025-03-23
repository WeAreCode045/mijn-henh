
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
    // Check if property ID exists and is a valid UUID
    if (!formData.id || formData.id.trim() === '') {
      toast({
        title: "Error",
        description: "No property ID found for saving",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    
    try {
      console.log("Saving content tab data...", formData);
      await autosaveData(formData);
      console.log("Content tab data saved successfully");
      setLastSaved(new Date());
      setPendingChanges(false);
      
      // Call the original onSubmit if provided
      if (onSubmitCallback) {
        onSubmitCallback();
      }
      
      toast({
        title: "Success",
        description: "Property content saved successfully",
      });
      
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
