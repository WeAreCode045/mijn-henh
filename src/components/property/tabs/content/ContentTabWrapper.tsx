
import React, { useState, useEffect } from 'react';
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
    handleNext?: () => void;
    handlePrevious?: () => void;
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
  
  // Create a centralized navigation handler
  const { 
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  } = usePropertyContentStepNavigation(
    formData,
    handlers.currentStep,
    handlers.handleStepClick,
    pendingChanges,
    setPendingChanges,
    setLastSaved,
    handlers.handleStepClick,
    handlers.handleNext,
    handlers.handlePrevious
  );

  // Create a complete bundle of all handlers needed for content routing
  const contentHandlers = {
    ...handlers,
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious,
    setPendingChanges: (value: boolean) => {
      setPendingChanges(value);
      if (handlers.setPendingChanges) {
        handlers.setPendingChanges(value);
      }
    }
  };

  return (
    <ContentRouter 
      formData={formData}
      currentStep={handlers.currentStep}
      handlers={contentHandlers}
    />
  );
}
