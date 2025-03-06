
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";
import { steps } from "@/components/property/form/formSteps";

export function usePropertyStepNavigation(
  formData: PropertyFormData,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const [currentStep, setCurrentStep] = useState(1);
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();
  const maxSteps = steps.length;

  // Single unified function to handle saving before changing steps
  const saveBeforeStepChange = async (newStep: number | ((prev: number) => number)) => {
    console.log("Saving before step change, pendingChanges:", pendingChanges, "formData.id:", formData.id);
    
    // Only save if there are pending changes and the form has an ID
    if (pendingChanges && formData.id) {
      try {
        const formEvent = {} as React.FormEvent;
        const success = await handleSubmit(formEvent, formData, false);
        
        if (success) {
          console.log("Save successful before step change");
          setLastSaved(new Date());
          setPendingChanges(false);
        } else {
          console.warn("Save was not successful before step change");
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
      }
    } else {
      console.log("No need to save before step change");
    }
    
    // Always change step even if save fails or is not needed
    if (typeof newStep === 'function') {
      setCurrentStep(newStep);
    } else {
      setCurrentStep(newStep);
    }
    return true;
  };

  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step);
    saveBeforeStepChange(step);
  };

  const handleNext = () => {
    console.log("Next clicked");
    if (currentStep < maxSteps) {
      saveBeforeStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked");
    if (currentStep > 1) {
      saveBeforeStepChange(currentStep - 1);
    }
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
