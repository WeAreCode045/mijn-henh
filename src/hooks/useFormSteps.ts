
import { useState } from "react";
import type { PropertyFormData } from "@/types/property";

export function useFormSteps(
  formData: PropertyFormData, 
  onAutosave: () => void,
  maxSteps: number
) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step >= 1 && step <= maxSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick
  };
}
