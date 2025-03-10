
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

  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    // Auto-save before changing step if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed with step change
            if (externalHandleStepClick) {
              externalHandleStepClick(step);
            } else {
              setCurrentStep(step);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before changing step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before changing step",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandleStepClick) {
            externalHandleStepClick(step);
          } else {
            setCurrentStep(step);
          }
        });
    } else {
      // No pending changes, just change step
      if (externalHandleStepClick) {
        externalHandleStepClick(step);
      } else {
        setCurrentStep(step);
      }
    }
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    // Auto-save before proceeding if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed to next step
            if (externalHandleNext) {
              externalHandleNext();
            } else if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before proceeding to next step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before proceeding",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandleNext) {
            externalHandleNext();
          } else if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
          }
        });
    } else {
      // No pending changes, just proceed
      if (externalHandleNext) {
        externalHandleNext();
      } else if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    // Auto-save before going back if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now go to previous step
            if (externalHandlePrevious) {
              externalHandlePrevious();
            } else if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before going to previous step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before going back",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandlePrevious) {
            externalHandlePrevious();
          } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          }
        });
    } else {
      // No pending changes, just go back
      if (externalHandlePrevious) {
        externalHandlePrevious();
      } else if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  return {
    handleStepClick,
    handleNext,
    handlePrevious
  };
}
