
import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { useLocationDataFetch } from '@/hooks/location/useLocationDataFetch';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { toast } = useToast();
  
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
  
  const handleStepClick = useCallback((step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    setCurrentStep(step);
  }, []);
  
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);
  
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  const onSubmit = useCallback(() => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setPendingChanges(false);
      setLastSaved(new Date());
      setIsSaving(false);
      
      toast({
        title: "Saved",
        description: "Changes saved successfully"
      });
    }, 1000);
  }, [toast]);
  
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
