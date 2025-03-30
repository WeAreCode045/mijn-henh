
import React, { useState, useCallback } from 'react';
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
  const [internalStep, setInternalStep] = useState(0);
  
  // Use either the prop's currentStep or the handlers' currentStep or default to internal state
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : 
                     (handlers?.currentStep !== undefined ? handlers.currentStep : internalStep);
  
  // Create a local step click handler as fallback
  const localHandleStepClick = useCallback((step: number) => {
    console.log("ContentTabWrapper local step handler called with step:", step);
    setInternalStep(step);
  }, []);
  
  // Choose the appropriate handleStepClick function with multiple fallbacks
  const effectiveHandleStepClick = 
    typeof propHandleStepClick === 'function' ? propHandleStepClick :
    typeof handlers?.handleStepClick === 'function' ? handlers.handleStepClick :
    localHandleStepClick;
  
  // Create a centralized navigation handler with robust fallback mechanism
  const { 
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  } = usePropertyContentStepNavigation(
    formData,
    currentStep,
    // Safe step click handler function with multiple fallbacks
    effectiveHandleStepClick,
    pendingChanges,
    (value: boolean) => {
      setPendingChanges(value);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(value);
    },
    setLastSaved,
    undefined,  // Remove propHandleStepClick to avoid circular reference
    handlers?.handleNext,
    handlers?.handlePrevious
  );

  // Create a complete bundle of all handlers needed for content routing
  const contentHandlers = {
    ...handlers,
    handleStepClick: internalHandleStepClick,
    currentStep: currentStep,
    setPendingChanges: (value: boolean) => {
      setPendingChanges(value);
      if (handlers?.setPendingChanges) {
        handlers.setPendingChanges(value);
      }
    },
    // Ensure safe handlers are available
    onFieldChange: handlers?.onFieldChange || ((field: keyof PropertyFormData, value: any) => {
      console.warn(`ContentTabWrapper - No onFieldChange handler provided. Would set ${String(field)} to:`, value);
    }),
    // Ensure isSaving is not undefined for ContentRouter
    isSaving: handlers?.isSaving || false,
    // Add handleNext and handlePrevious to the handlers
    handleNext,
    handlePrevious,
    // Ensure area image upload handler is always available
    onAreaImageUpload: handlers?.onAreaImageUpload || handlers?.handleAreaImageUpload || 
      ((areaId: string, files: FileList) => {
        console.warn("ContentTabWrapper - No area image upload handler provided");
        return Promise.resolve();
      }),
    // Ensure onAddArea is always available with a fallback
    onAddArea: handlers?.onAddArea || (() => {
      console.warn("ContentTabWrapper - No onAddArea handler provided");
    }),
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
