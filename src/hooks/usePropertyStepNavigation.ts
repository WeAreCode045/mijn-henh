
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";
import { steps } from "@/components/property/form/formSteps";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";

export function usePropertyStepNavigation(
  formData: PropertyFormData,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit } = usePropertyFormSubmit();
  const { autosaveData } = usePropertyAutoSave();
  const { toast } = useToast();
  const maxSteps = steps.length;
  const [isSaving, setIsSaving] = useState(false);

  // Single unified function to handle saving before changing steps
  const saveBeforeStepChange = useCallback(async (newStep: number | ((prev: number) => number)) => {
    console.log("Saving before step change, pendingChanges:", pendingChanges, "formData.id:", formData.id);
    setIsSaving(true);
    
    // Only save if there are pending changes and the form has an ID
    if (pendingChanges && formData.id) {
      try {
        // Use the autosaveData function to save changes
        const success = await autosaveData(formData);
        
        if (success) {
          console.log("Auto-save successful before step change");
          setLastSaved(new Date());
          setPendingChanges(false);
          toast({
            description: "Changes saved automatically",
          });
        } else {
          console.warn("Auto-save was not successful before step change");
          toast({
            title: "Warning",
            description: "Unable to save changes before changing step",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to save before changing step:", error);
        toast({
          title: "Warning",
          description: "Changes couldn't be saved before changing step",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("No need to save before step change");
      setIsSaving(false);
    }
    
    // Always change step even if save fails or is not needed
    if (typeof newStep === 'function') {
      setCurrentStep(newStep);
    } else {
      setCurrentStep(newStep);
    }
    return true;
  }, [pendingChanges, formData, autosaveData, setLastSaved, setPendingChanges, toast]);

  const handleStepClick = useCallback((step: number) => {
    console.log("Step clicked:", step, "Current formData:", formData);
    saveBeforeStepChange(step);
  }, [formData, saveBeforeStepChange]);

  const handleNext = useCallback(() => {
    console.log("Next clicked", "Current formData:", formData);
    if (currentStep < maxSteps - 1) {
      saveBeforeStepChange(currentStep + 1);
    }
  }, [currentStep, maxSteps, formData, saveBeforeStepChange]);

  const handlePrevious = useCallback(() => {
    console.log("Previous clicked", "Current formData:", formData);
    if (currentStep > 0) {
      saveBeforeStepChange(currentStep - 1);
    }
  }, [currentStep, formData, saveBeforeStepChange]);

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    isSaving
  };
}
