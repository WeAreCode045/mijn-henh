
import { PropertyFormData } from '@/types/property';
import { useLocationFunctions } from './property-content/useLocationFunctions';
import { useNearbyPlaces } from './property-content/useNearbyPlaces';
import { useStepNavigation } from './property-content/useStepNavigation';
import { useSaveStatus } from './property-content/useSaveStatus';

export function usePropertyContent(formData: PropertyFormData, onFieldChange: (field: keyof PropertyFormData, value: any) => void) {
  // Location and map related functions
  const { 
    fetchLocationData, 
    generateLocationDescription, 
    generateMapImage,
    isLoadingLocationData,
    isGeneratingMap
  } = useLocationFunctions(formData, onFieldChange);
  
  // Nearby places management
  const { removeNearbyPlace } = useNearbyPlaces(formData, onFieldChange);
  
  // Step navigation
  const { 
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious
  } = useStepNavigation();
  
  // Save status management
  const { 
    lastSaved,
    setLastSaved,
    isSaving,
    pendingChanges,
    setPendingChanges,
    onSubmit
  } = useSaveStatus();

  return { 
    // Location functions
    fetchLocationData, 
    generateLocationDescription, 
    generateMapImage,
    isLoadingLocationData,
    isGeneratingMap,
    
    // Nearby places functions
    removeNearbyPlace,
    
    // Step navigation
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    
    // Save status
    onSubmit,
    lastSaved,
    isSaving,
    setPendingChanges
  };
}
