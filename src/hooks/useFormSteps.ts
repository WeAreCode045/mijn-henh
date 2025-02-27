
import { useState, useCallback } from "react";
import type { PropertyFormData } from "@/types/property";

export function useFormSteps(
  formData: PropertyFormData, 
  onAutosave: () => void,
  maxSteps: number
) {
  const [currentStep, setCurrentStep] = useState(1);

  // Validate that the form data is ready before allowing navigation
  const isFormDataReady = useCallback(() => {
    return formData !== undefined && formData !== null;
  }, [formData]);

  // Use useCallback to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    console.log("handleNext called, current step:", currentStep, "maxSteps:", maxSteps);
    if (currentStep < maxSteps && isFormDataReady()) {
      const nextStep = currentStep + 1;
      console.log("Moving to next step:", nextStep);
      setCurrentStep(nextStep);
      // Save data when moving to next step
      onAutosave();
    }
  }, [currentStep, maxSteps, onAutosave, isFormDataReady]);

  const handlePrevious = useCallback(() => {
    console.log("handlePrevious called, current step:", currentStep);
    if (currentStep > 1 && isFormDataReady()) {
      const prevStep = currentStep - 1;
      console.log("Moving to previous step:", prevStep);
      setCurrentStep(prevStep);
      // Save data when moving to previous step
      onAutosave();
    }
  }, [currentStep, onAutosave, isFormDataReady]);

  const handleStepClick = useCallback((step: number) => {
    console.log("handleStepClick called, selected step:", step);
    if (step >= 1 && step <= maxSteps && isFormDataReady()) {
      console.log("Setting current step to:", step);
      setCurrentStep(step);
      // Save data when directly clicking a step
      onAutosave();
    }
  }, [maxSteps, onAutosave, isFormDataReady]);

  return {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick
  };
}
