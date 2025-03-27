
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { steps } from "@/components/property/form/formSteps";
import { useCallback } from "react";

export function usePropertyContentStepNavigation(
  formData: PropertyFormData,
  currentStep: number,
  setCurrentStep: (step: number) => void,
  pendingChanges: boolean,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void,
  externalHandleStepClick?: (step: number) => void,
  externalHandleNext?: () => void,
  externalHandlePrevious?: () => void
) {
  const { toast } = useToast();
  const maxSteps = steps.length;

  // Handle step clicks with robust error handling and fallbacks
  const handleStepClick = useCallback((step: number) => {
    console.log("usePropertyContentStepNavigation - handleStepClick with step:", step);
    
    if (typeof externalHandleStepClick === 'function') {
      console.log("usePropertyContentStepNavigation - using external handler");
      externalHandleStepClick(step);
      return true;
    } 
    
    if (typeof setCurrentStep === 'function') {
      console.log("usePropertyContentStepNavigation - using setCurrentStep directly");
      setCurrentStep(step);
      return true;
    }
    
    console.error("usePropertyContentStepNavigation - No valid handler available");
    toast({
      title: "Navigation Error",
      description: "Could not navigate to the selected step",
      variant: "destructive"
    });
    return false;
  }, [externalHandleStepClick, setCurrentStep, toast]);
  
  // Handle next button click
  const handleNext = useCallback(() => {
    console.log("usePropertyContentStepNavigation - handleNext called, current step:", currentStep);
    
    if (typeof externalHandleNext === 'function') {
      console.log("usePropertyContentStepNavigation - using external next handler");
      externalHandleNext();
      return true;
    } 
    
    if (currentStep < maxSteps - 1 && typeof setCurrentStep === 'function') {
      console.log("usePropertyContentStepNavigation - using setCurrentStep directly for next");
      setCurrentStep(currentStep + 1);
      return true;
    }
    
    return false;
  }, [currentStep, externalHandleNext, maxSteps, setCurrentStep]);
  
  // Handle previous button click
  const handlePrevious = useCallback(() => {
    console.log("usePropertyContentStepNavigation - handlePrevious called, current step:", currentStep);
    
    if (typeof externalHandlePrevious === 'function') {
      console.log("usePropertyContentStepNavigation - using external previous handler");
      externalHandlePrevious();
      return true;
    } 
    
    if (currentStep > 0 && typeof setCurrentStep === 'function') {
      console.log("usePropertyContentStepNavigation - using setCurrentStep directly for previous");
      setCurrentStep(currentStep - 1);
      return true;
    }
    
    return false;
  }, [currentStep, externalHandlePrevious, setCurrentStep]);

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
