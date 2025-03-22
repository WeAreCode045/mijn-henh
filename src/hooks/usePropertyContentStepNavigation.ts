
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

  // Unified function to handle saving before changing steps
  const saveBeforeStepChange = async (action: 'step' | 'next' | 'previous', stepNum?: number) => {
    console.log("Saving before changing steps, pendingChanges:", pendingChanges, "formData.id:", formData.id);
    
    // Only save if there are pending changes and the property exists
    if (pendingChanges && formData.id) {
      try {
        const formEvent = {} as React.FormEvent;
        const success = await handleSubmit(formEvent, formData, false);
        
        if (success) {
          setLastSaved(new Date());
          setPendingChanges(false);
          console.log("Save successful before navigation");
        } else {
          console.warn("Save was not successful before navigation");
          toast({
            title: "Warning",
            description: "Unable to save changes before navigation",
            variant: "destructive",
          });
          // Still continue with navigation
        }
      } catch (error) {
        console.error(`Failed to save before ${action}:`, error);
        toast({
          title: "Warning",
          description: "Changes couldn't be saved before navigation",
          variant: "destructive",
        });
        // Still continue with navigation
      }
    } else {
      console.log("No need to save before navigation");
    }
    
    // Always proceed with the navigation, even if save fails
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
        } else if (currentStep < maxSteps - 1) {
          setCurrentStep(currentStep + 1);
        }
        break;
      case 'previous':
        console.log("Navigating to previous step");
        if (externalHandlePrevious) {
          externalHandlePrevious();
        } else if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        }
        break;
    }

    return true;
  };

  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    return saveBeforeStepChange('step', step);
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    return saveBeforeStepChange('next');
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    return saveBeforeStepChange('previous');
  };

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
