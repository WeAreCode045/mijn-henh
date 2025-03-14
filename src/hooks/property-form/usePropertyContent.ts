
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { useLocationDataFetch } from '@/hooks/useLocationDataFetch';

export function usePropertyContent(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  const { 
    fetchLocationData, 
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription, 
    generateMapImage,
    removeNearbyPlace,
    isLoading: isLoadingLocationData,
    isGeneratingMap
  } = useLocationDataFetch(formData, onFieldChange);
  
  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onSubmit = () => {
    setPendingChanges(false);
    setLastSaved(new Date());
  };
  
  return {
    fetchLocationData,
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    lastSaved,
    isSaving,
    setPendingChanges,
    onSubmit
  };
}
