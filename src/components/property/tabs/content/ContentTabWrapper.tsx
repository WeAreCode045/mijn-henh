
import React, { useState } from 'react';
import { PropertyData, PropertyFormData } from "@/types/property";
import { ContentRouter } from './ContentRouter';
import { usePropertyContentStepNavigation } from '@/hooks/usePropertyContentStepNavigation';
import { ContentTabNavigation } from './ContentTabNavigation';

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData;
  handlers?: {
    onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature?: () => void;
    onRemoveFeature?: (id: string) => void;
    onUpdateFeature?: (id: string, description: string) => void;
    onAddArea?: () => void;
    onRemoveArea?: (id: string) => void;
    onUpdateArea?: (id: string, field: any, value: any) => void;
    onAreaImageRemove?: (areaId: string, imageId: string) => void;
    onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
    onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    currentStep?: number;
    handleStepClick?: (step: number) => void;
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
    isUpdateMode?: boolean;
    isUploading?: boolean;
    onSubmit?: () => void;
    isSaving?: boolean;
  };
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  handleSave?: () => void;
}

export function ContentTabWrapper({ 
  formData,
  property,
  handlers = {},
  currentStep: propCurrentStep,
  handleStepClick: propHandleStepClick,
  handleSave
}: ContentTabWrapperProps) {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Use either the prop's currentStep or the handlers' currentStep or default to 0
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : 
                     (handlers.currentStep !== undefined ? handlers.currentStep : 0);
  
  // Create a centralized navigation handler with robust fallback mechanism
  const { 
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  } = usePropertyContentStepNavigation(
    formData,
    currentStep,
    // Safe step click handler function with multiple fallbacks
    (step: number) => {
      console.log("ContentTabWrapper step click handler called with step:", step);
      
      // First try the prop's handleStepClick
      if (typeof propHandleStepClick === 'function') {
        propHandleStepClick(step);
        return;
      }
      
      // Then try the handlers.handleStepClick
      if (typeof handlers.handleStepClick === 'function') {
        handlers.handleStepClick(step);
        return;
      }
      
      // If no handler is provided, log a warning
      console.warn("ContentTabWrapper - No step click handler provided");
    },
    pendingChanges,
    setPendingChanges,
    setLastSaved,
    propHandleStepClick || handlers.handleStepClick,
    handlers.handleNext,
    handlers.handlePrevious
  );

  // Create a complete bundle of all handlers needed for content routing
  const contentHandlers = {
    ...handlers,
    handleStepClick: internalHandleStepClick,
    currentStep: currentStep,
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
    handlePrevious,
    // Ensure area image upload handler is always available
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload || 
      ((areaId: string, files: FileList) => {
        console.warn("ContentTabWrapper - No area image upload handler provided");
        return Promise.resolve();
      }),
    // Ensure onAddArea is always available with a fallback
    onAddArea: handlers.onAddArea || (() => {
      console.warn("ContentTabWrapper - No onAddArea handler provided");
    }),
    // Ensure onFieldChange is always available
    onFieldChange: handlers.onFieldChange || ((field: keyof PropertyFormData, value: any) => {
      console.warn(`ContentTabWrapper - No onFieldChange handler provided. Would set ${String(field)} to:`, value);
    })
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={currentStep} 
        onStepClick={internalHandleStepClick}
      />
      
      <ContentRouter 
        formData={formData}
        property={property}
        currentStep={currentStep}
        handlers={contentHandlers}
      />
    </div>
  );
}
