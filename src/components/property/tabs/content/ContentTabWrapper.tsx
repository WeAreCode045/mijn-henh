
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { ContentTabContent } from "./ContentTabContent";
import { useFormSteps } from "@/hooks/useFormSteps";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
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
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    setPendingChanges?: (pending: boolean) => void;
    currentStep?: number;
    handleStepClick?: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onFetchCategoryPlaces?: (category: string) => Promise<any>;
    onFetchNearbyCities?: () => Promise<any>;
    onGenerateLocationDescription?: () => Promise<void>;
    onGenerateMap?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    isGeneratingMap?: boolean;
    isUploading?: boolean;
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  // Local state to manage autosave
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Use this as a dummy autosave function since we don't want to implement full
  // autosave functionality in this component right now
  const handleAutosave = () => {
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
    setLastSaved(new Date());
  };
  
  // Initialize form step handling
  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    handleAutosave,
    5 // Max 5 steps
  );
  
  // Prioritize external step handler if provided
  const handleStepNavigation = handlers.handleStepClick || handleStepClick;

  return (
    <ContentTabContent
      formData={formData}
      handlers={{
        ...handlers,
        // Don't pass the external currentStep/handleStepClick if we're using our own
        currentStep: handlers.currentStep !== undefined ? handlers.currentStep : currentStep,
        handleStepClick: handleStepNavigation,
        handleNext,
        handlePrevious,
        setPendingChanges: handlers.setPendingChanges || setPendingChanges
      }}
      lastSaved={lastSaved}
    />
  );
}
