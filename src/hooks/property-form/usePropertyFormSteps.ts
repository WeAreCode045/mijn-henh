
import { useState, useCallback } from "react";

export function usePropertyFormSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleStepClick = useCallback((step: number) => {
    console.log("usePropertyFormSteps - handleStepClick called with step:", step);
    setCurrentStep(step);
  }, []);
  
  const handleNext = useCallback(() => {
    console.log("usePropertyFormSteps - handleNext called, current step:", currentStep);
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, [currentStep]);
  
  const handlePrevious = useCallback(() => {
    console.log("usePropertyFormSteps - handlePrevious called, current step:", currentStep);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, [currentStep]);
  
  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
