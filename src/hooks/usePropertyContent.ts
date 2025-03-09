
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFeature, PropertyFormData } from '@/types/property';
import { steps } from '@/components/property/form/formSteps';
import { useToast } from '@/components/ui/use-toast';
import { useLocationDataFetch } from './useLocationDataFetch';
import { usePropertyFormSubmit } from './usePropertyFormSubmit';
import { usePropertyAutoSave } from './usePropertyAutoSave';

export function usePropertyContent(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { toast } = useToast();
  const { handleSubmit } = usePropertyFormSubmit();
  const { autosaveData, isSaving, lastSaved } = usePropertyAutoSave();
  
  const { 
    fetchLocationData, 
    generateLocationDescription,
    removeNearbyPlace, 
    isLoading: isLoadingLocationData 
  } = useLocationDataFetch(formData, onFieldChange);

  // Save when step changes or when triggered manually
  const handleSave = async () => {
    if (!formData || !pendingChanges) return;
    
    try {
      console.log("Saving changes to property");
      const event = {} as React.FormEvent;
      const result = await handleSubmit(event, formData, false);
      
      if (result) {
        setPendingChanges(false);
        toast({
          title: "Success",
          description: "Changes saved successfully",
        });
      }
      return result;
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleStepClick = async (stepId: number) => {
    console.log(`usePropertyContent - Setting current step to ${stepId}`);
    
    // First save any pending changes
    if (pendingChanges) {
      const saveResult = await handleSave();
      if (saveResult) {
        setCurrentStep(stepId);
      }
    } else {
      setCurrentStep(stepId);
    }
  };

  const handleNext = async () => {
    console.log(`usePropertyContent - Current step: ${currentStep}, max steps: ${steps.length}`);
    
    // Save changes before moving to next step
    if (pendingChanges) {
      const saveResult = await handleSave();
      if (saveResult && currentStep < steps.length) {
        console.log(`usePropertyContent - Moving to next step: ${currentStep + 1}`);
        setCurrentStep(prevStep => prevStep + 1);
      }
    } else if (currentStep < steps.length) {
      console.log(`usePropertyContent - Moving to next step: ${currentStep + 1}`);
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      console.log('usePropertyContent - Already at the last step');
    }
  };

  const handlePrevious = async () => {
    // Save changes before moving to previous step
    if (pendingChanges) {
      const saveResult = await handleSave();
      if (saveResult && currentStep > 1) {
        console.log(`usePropertyContent - Moving to previous step: ${currentStep - 1}`);
        setCurrentStep(prevStep => prevStep - 1);
      }
    } else if (currentStep > 1) {
      console.log(`usePropertyContent - Moving to previous step: ${currentStep - 1}`);
      setCurrentStep(prevStep => prevStep - 1);
    } else {
      console.log('usePropertyContent - Already at the first step');
    }
  };

  const onSubmit = async () => {
    await handleSave();
    console.log('usePropertyContent - Form submitted and saved');
    toast({
      title: "Form submitted",
      description: "Your changes have been saved."
    });
  };

  // Handle field changes and track if there are pending changes
  const handleFieldChangeWithTracking = useCallback((field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    setPendingChanges(true);
  }, [onFieldChange]);

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
    setPendingChanges(true);
  }, [formData, onFieldChange]);

  const removeFeature = useCallback((id: string) => {
    console.log("usePropertyContent - Removing feature with ID:", id);
    const updatedFeatures = (formData.features || []).filter(feature => feature.id !== id);
    console.log("usePropertyContent - Updated features after removal:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
    setPendingChanges(true);
  }, [formData, onFieldChange]);

  const updateFeature = useCallback((id: string, description: string) => {
    console.log("usePropertyContent - Updating feature with ID:", id, "New description:", description);
    const updatedFeatures = (formData.features || []).map(feature => 
      feature.id === id ? { ...feature, description } : feature
    );
    console.log("usePropertyContent - Updated features after update:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
    setPendingChanges(true);
  }, [formData, onFieldChange]);

  // Call the functions from useLocationDataFetch
  const handleFetchLocationData = async () => {
    await fetchLocationData();
    setPendingChanges(true);
  };

  const handleGenerateLocationDescription = async () => {
    await generateLocationDescription();
    setPendingChanges(true);
  };

  const handleRemoveNearbyPlace = (index: number) => {
    removeNearbyPlace(index);
    setPendingChanges(true);
  };

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    handleFieldChange: handleFieldChangeWithTracking,
    // Feature management
    addFeature,
    removeFeature,
    updateFeature,
    // Location management
    onFetchLocationData: handleFetchLocationData,
    onGenerateLocationDescription: handleGenerateLocationDescription,
    onRemoveNearbyPlace: handleRemoveNearbyPlace,
    isLoadingLocationData,
    // Change tracking
    pendingChanges,
    setPendingChanges,
    handleSave,
    isSaving,
    lastSaved
  };
}
