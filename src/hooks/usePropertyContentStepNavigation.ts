
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { steps } from "@/components/property/form/formSteps";

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
  const { handleSubmit } = usePropertyFormSubmit();
  const maxSteps = steps.length;

  // Modified to handle missing handler more gracefully
  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    
    // Check all possible handler functions in order of preference
    if (typeof externalHandleStepClick === 'function') {
      externalHandleStepClick(step);
      return true;
    } 
    
    if (typeof setCurrentStep === 'function') {
      setCurrentStep(step);
      return true;
    }
    
    // Only log error if we couldn't find any valid handler
    console.error("No valid step click handler provided");
    return false;
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    
    // Just move to next step without auto-saving
    if (typeof externalHandleNext === 'function') {
      externalHandleNext();
      return true;
    } 
    
    if (currentStep < maxSteps - 1 && typeof setCurrentStep === 'function') {
      setCurrentStep(currentStep + 1);
      return true;
    }
    
    return false;
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    
    // Just move to previous step without auto-saving
    if (typeof externalHandlePrevious === 'function') {
      externalHandlePrevious();
      return true;
    } 
    
    if (currentStep > 0 && typeof setCurrentStep === 'function') {
      setCurrentStep(currentStep - 1);
      return true;
    }
    
    return false;
  };

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
