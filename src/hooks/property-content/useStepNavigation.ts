
import { useState, useCallback } from 'react';

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);
  
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);
  
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
