
import { useCallback } from "react";
import { PropertyFormData } from "@/types/property";

export function usePropertyContentStepNavigation(
  formData: PropertyFormData,
  currentStep: number,
  handleStepClick: (step: number) => void,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void,
  externalStepClick?: (step: number) => void,
  externalNext?: () => void,
  externalPrev?: () => void
) {
  // Safe wrapper for the step click handler
  const internalHandleStepClick = useCallback((step: number) => {
    console.log("usePropertyContentStepNavigation - Step clicked:", step);
    
    // Call the provided handler first
    if (typeof handleStepClick === 'function') {
      handleStepClick(step);
    }
    
    // If there's an additional external handler, call it too
    if (typeof externalStepClick === 'function') {
      externalStepClick(step);
    }
  }, [handleStepClick, externalStepClick]);
  
  // Next step handler
  const handleNext = useCallback(() => {
    console.log("usePropertyContentStepNavigation - Next clicked, current step:", currentStep);
    
    // Move to next step
    const nextStep = currentStep + 1;
    if (nextStep <= 3) { // Assuming max 4 steps (0-3)
      internalHandleStepClick(nextStep);
    }
    
    // If there's an external next handler, call it too
    if (typeof externalNext === 'function') {
      externalNext();
    }
  }, [currentStep, internalHandleStepClick, externalNext]);
  
  // Previous step handler
  const handlePrevious = useCallback(() => {
    console.log("usePropertyContentStepNavigation - Previous clicked, current step:", currentStep);
    
    // Move to previous step
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      internalHandleStepClick(prevStep);
    }
    
    // If there's an external previous handler, call it too
    if (typeof externalPrev === 'function') {
      externalPrev();
    }
  }, [currentStep, internalHandleStepClick, externalPrev]);

  return {
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  };
}
