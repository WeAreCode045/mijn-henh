
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

  // Modified to simply change steps without auto-saving
  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    
    // Just change the step without auto-saving
    if (externalHandleStepClick) {
      externalHandleStepClick(step);
    } else {
      setCurrentStep(step);
    }
    
    return true;
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    
    // Just move to next step without auto-saving
    if (externalHandleNext) {
      externalHandleNext();
    } else if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    return true;
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    
    // Just move to previous step without auto-saving
    if (externalHandlePrevious) {
      externalHandlePrevious();
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    
    return true;
  };

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
