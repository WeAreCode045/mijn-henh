
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
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
  const maxSteps = steps.length;

  // Unified function to handle navigation without saving
  const handleNavigation = async (action: 'step' | 'next' | 'previous', stepNum?: number) => {
    console.log("Navigating without saving, pendingChanges:", pendingChanges, "formData.id:", formData.id);
    
    // Always proceed with the navigation
    switch (action) {
      case 'step':
        if (stepNum !== undefined) {
          console.log("Navigating to step:", stepNum);
          if (externalHandleStepClick) {
            externalHandleStepClick(stepNum);
          } else {
            setCurrentStep(stepNum);
          }
        }
        break;
      case 'next':
        console.log("Navigating to next step");
        if (externalHandleNext) {
          externalHandleNext();
        } else if (currentStep < maxSteps) {
          setCurrentStep(currentStep + 1);
        }
        break;
      case 'previous':
        console.log("Navigating to previous step");
        if (externalHandlePrevious) {
          externalHandlePrevious();
        } else if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
        break;
    }
  };

  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    handleNavigation('step', step);
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    handleNavigation('next');
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    handleNavigation('previous');
  };

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
