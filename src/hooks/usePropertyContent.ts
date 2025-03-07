
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFeature, PropertyFormData } from '@/types/property';
import { steps } from '@/components/property/form/formSteps';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
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

  // Feature management functions
  const addFeature = useCallback(() => {
    console.log("usePropertyContent - Adding new feature");
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    // Make sure to clone the existing features array or create a new one if it doesn't exist
    const updatedFeatures = [...(formData.features || []), newFeature];
    console.log("usePropertyContent - Updated features:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const removeFeature = useCallback((id: string) => {
    console.log("usePropertyContent - Removing feature with ID:", id);
    const updatedFeatures = (formData.features || []).filter(feature => feature.id !== id);
    console.log("usePropertyContent - Updated features after removal:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const updateFeature = useCallback((id: string, description: string) => {
    console.log("usePropertyContent - Updating feature with ID:", id, "New description:", description);
    const updatedFeatures = (formData.features || []).map(feature => 
      feature.id === id ? { ...feature, description } : feature
    );
    console.log("usePropertyContent - Updated features after update:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    handleFieldChange: onFieldChange,
    // Feature management
    addFeature,
    removeFeature,
    updateFeature
  };
}
