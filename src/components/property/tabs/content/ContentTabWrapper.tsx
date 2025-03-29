
import React, { useState } from 'react';
import { PropertyData, PropertyFormData } from "@/types/property";
import { ContentRouter } from './ContentRouter';
import { usePropertyContentStepNavigation } from '@/hooks/usePropertyContentStepNavigation';
import { ContentTabNavigation } from './ContentTabNavigation';

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
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
    currentStep: number;
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
  console.log("ContentTabWrapper - Current step:", handlers.currentStep);
  console.log("ContentTabWrapper - onAddArea is function:", typeof handlers.onAddArea === 'function');
  
  // Create a centralized navigation handler with robust fallback mechanism
  const { 
    handleStepClick: internalHandleStepClick,
    handleNext,
    handlePrevious
  } = usePropertyContentStepNavigation(
    formData,
    handlers.currentStep,
    // Pass a safe step click handler function
    (step: number) => {
      console.log("ContentTabWrapper fallback handler called with step:", step);
      if (typeof handlers.handleStepClick === 'function') {
        handlers.handleStepClick(step);
      } else {
        console.warn("ContentTabWrapper - No external step click handler provided");
      }
    },
    pendingChanges,
    setPendingChanges,
    setLastSaved,
    handlers.handleStepClick, // Pass the original handler function
    handlers.handleNext,
    handlers.handlePrevious
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
    handlePrevious,
    // Ensure area image upload handler is always available
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload,
    // Ensure onAddArea is always available with a fallback
    onAddArea: handlers.onAddArea || (() => {
      console.warn("ContentTabWrapper - No onAddArea handler provided");
    }),
    // Ensure onFieldChange is always available
    onFieldChange: handlers.onFieldChange
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep} 
        onStepClick={internalHandleStepClick}
      />
      
      <ContentRouter 
        formData={formData}
        property={property}
        currentStep={handlers.currentStep}
        handlers={contentHandlers}
      />
    </div>
  );
}
