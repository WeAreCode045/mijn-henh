
import React, { useState } from 'react';
import { PropertyData, PropertyFormData } from "@/types/property";
import { ContentRouter } from './ContentRouter';
import { usePropertyContentStepNavigation } from '@/hooks/usePropertyContentStepNavigation';

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: any, value: any) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onFetchCategoryPlaces?: (category: string) => Promise<any>;
    onFetchNearbyCities?: () => Promise<any>;
    onGenerateLocationDescription?: () => Promise<void>;
    onGenerateMap?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    isGeneratingMap?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ 
  formData,
  property,
  handlers
}: ContentTabWrapperProps) {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Log handlers to help with debugging
  console.log("ContentTabWrapper - handleStepClick is function:", typeof handlers.handleStepClick === 'function');
  
  // Create a centralized navigation handler
  const { 
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  } = usePropertyContentStepNavigation(
    formData,
    handlers.currentStep,
    // Pass a fallback function that at least logs what's happening
    typeof handlers.handleStepClick === 'function' 
      ? handlers.handleStepClick 
      : (step: number) => {
          console.log("Fallback step click handler called with step:", step);
          // Can't do anything more without a real handler
        },
    pendingChanges,
    setPendingChanges,
    setLastSaved,
    handlers.handleStepClick // Pass the original handler function
  );

  // Create a complete bundle of all handlers needed for content routing
  const contentHandlers = {
    ...handlers,
    handleStepClick: internalHandleStepClick,
    setPendingChanges: (value: boolean) => {
      setPendingChanges(value);
      if (handlers.setPendingChanges) {
        handlers.setPendingChanges(value);
      }
    },
    // Ensure isSaving is not undefined for ContentRouter
    isSaving: handlers.isSaving || false,
    // Add handleNext and handlePrevious to the handlers
    handleNext,
    handlePrevious
  };

  return (
    <ContentRouter 
      formData={formData}
      property={property}
      currentStep={handlers.currentStep}
      handlers={contentHandlers}
    />
  );
}
