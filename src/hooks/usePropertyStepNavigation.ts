
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
  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();
  const maxSteps = steps.length;

  // Modified to simply change steps without auto-saving
  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step, "Current formData:", formData);
    setCurrentStep(step);
  };

  const handleNext = () => {
    console.log("Next clicked", "Current formData:", formData);
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked", "Current formData:", formData);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
