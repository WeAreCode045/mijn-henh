
import { useState } from "react";
import type { PropertyFormData } from "@/types/property";

export function useFormSteps(
  formData: PropertyFormData, 
  onAutosave: () => void,
  maxSteps: number
) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    console.log("handleNext called, current step:", currentStep, "maxSteps:", maxSteps);
    if (currentStep < maxSteps) {
      const nextStep = currentStep + 1;
      console.log("Moving to next step:", nextStep);
      setCurrentStep(nextStep);
      // Save data when moving to next step
      onAutosave();
    }
  };

  const handlePrevious = () => {
    console.log("handlePrevious called, current step:", currentStep);
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      console.log("Moving to previous step:", prevStep);
      setCurrentStep(prevStep);
      // Save data when moving to previous step
      onAutosave();
    }
  };

  const handleStepClick = (step: number) => {
    console.log("handleStepClick called, selected step:", step);
    if (step >= 1 && step <= maxSteps) {
      console.log("Setting current step to:", step);
      setCurrentStep(step);
      // Save data when directly clicking a step
      onAutosave();
    }
  };

  return {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick
  };
}
