
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { steps } from "@/components/property/form/formSteps";

export function usePropertyStepNavigation(
  formData: PropertyFormData,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const maxSteps = steps.length;

  // Single unified function to handle step changes without saving
  const handleStepChange = (newStep: number | ((prev: number) => number)) => {
    console.log("Step change, pendingChanges:", pendingChanges, "formData.id:", formData.id);
    
    // Always change step 
    if (typeof newStep === 'function') {
      setCurrentStep(newStep);
    } else {
      setCurrentStep(newStep);
    }
    return true;
  };

  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step, "Current formData:", formData);
    handleStepChange(step);
  };

  const handleNext = () => {
    console.log("Next clicked", "Current formData:", formData);
    if (currentStep < maxSteps - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked", "Current formData:", formData);
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
