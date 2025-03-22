
import { useState, useCallback } from "react";

export function usePropertyFormSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);
  
  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);
  
  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
