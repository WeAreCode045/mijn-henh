
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFeature, PropertyFormData, PropertyTechnicalItem } from '@/types/property';
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
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    const updatedFeatures = [...(formData.features || []), newFeature];
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const removeFeature = useCallback((id: string) => {
    const updatedFeatures = formData.features.filter(feature => feature.id !== id);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const updateFeature = useCallback((id: string, description: string) => {
    const updatedFeatures = formData.features.map(feature => 
      feature.id === id ? { ...feature, description } : feature
    );
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  // Technical item management functions
  const addTechnicalItem = useCallback(() => {
    const newItem: PropertyTechnicalItem = {
      id: uuidv4(),
      title: '',
      size: '',
      description: '',
      floorplanId: null
    };
    
    const currentItems = formData.technicalItems || [];
    onFieldChange('technicalItems', [...currentItems, newItem]);
  }, [formData, onFieldChange]);

  const removeTechnicalItem = useCallback((id: string) => {
    const currentItems = formData.technicalItems || [];
    const updatedItems = currentItems.filter(item => item.id !== id);
    onFieldChange('technicalItems', updatedItems);
  }, [formData, onFieldChange]);

  const updateTechnicalItem = useCallback((id: string, field: keyof PropertyTechnicalItem, value: any) => {
    const currentItems = formData.technicalItems || [];
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onFieldChange('technicalItems', updatedItems);
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
    updateFeature,
    // Technical item management
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem
  };
}
