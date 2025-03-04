
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyStepNavigation(
  formData: PropertyFormData,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const [currentStep, setCurrentStep] = useState(1);
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();

  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step);
    // Auto-save before changing step if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed with step change
            setCurrentStep(step);
          }
        })
        .catch((error) => {
          console.error("Failed to save before changing step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before changing step",
            variant: "destructive",
          });
          // Still allow step change
          setCurrentStep(step);
        });
    } else {
      // No pending changes, just change step
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    console.log("Next clicked");
    // Auto-save before proceeding if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed to next step
            if (currentStep < 5) {
              setCurrentStep(currentStep + 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before proceeding to next step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before proceeding",
            variant: "destructive",
          });
          // Still allow step change
          if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
          }
        });
    } else {
      // No pending changes, just proceed
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked");
    // Auto-save before going back if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now go to previous step
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before going to previous step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before going back",
            variant: "destructive",
          });
          // Still allow step change
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          }
        });
    } else {
      // No pending changes, just go back
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
