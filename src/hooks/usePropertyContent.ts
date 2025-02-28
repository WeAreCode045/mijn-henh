
import { useState } from 'react';
import { steps } from '@/components/property/form/formSteps';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleStepClick = (stepId: number) => {
    console.log(`usePropertyContent - Setting current step to ${stepId}`);
    setCurrentStep(stepId);
  };

  const handleNext = () => {
    console.log(`usePropertyContent - Current step: ${currentStep}, max steps: ${steps.length}`);
    if (currentStep < steps.length) {
      console.log(`usePropertyContent - Moving to next step: ${currentStep + 1}`);
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      console.log('usePropertyContent - Already at the last step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      console.log(`usePropertyContent - Moving to previous step: ${currentStep - 1}`);
      setCurrentStep(prevStep => prevStep - 1);
    } else {
      console.log('usePropertyContent - Already at the first step');
    }
  };

  const onSubmit = () => {
    console.log('usePropertyContent - Form submitted');
    toast({
      title: "Form submitted",
      description: "Your changes have been saved."
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    console.log(`Field "${field}" changed to:`, value);
    // This function is just a placeholder as the actual changes
    // are handled in the parent component
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    handleFieldChange
  };
}
