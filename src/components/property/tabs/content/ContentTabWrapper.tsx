
import { useState, useCallback } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData; // Added property field
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
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ formData, property, handlers }: ContentTabWrapperProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { onSubmit, isSaving } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || (() => {}),
    setLastSaved,
    handlers.onSubmit // Pass the onSubmit from handlers
  );

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Submit triggered in ContentTabWrapper");
    onSubmit();
  }, [onSubmit]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (handlers.currentStep < 3) {
      // Save current step before moving to next
      handleSubmit();
      setTimeout(() => {
        handlers.handleStepClick(handlers.currentStep + 1);
      }, 300);
    }
  }, [handleSubmit, handlers]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (handlers.currentStep > 0) {
      // Save current step before moving to previous
      handleSubmit();
      setTimeout(() => {
        handlers.handleStepClick(handlers.currentStep - 1);
      }, 300);
    }
  }, [handleSubmit, handlers]);

  const renderSectionSaveButton = () => {
    return (
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSaving || handlers.isSaving}
        size="sm"
        className="mt-4 flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save This Section
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={handleSubmit}
        isSaving={isSaving || handlers.isSaving || false}
      />
      
      <ContentTabContent
        property={property} 
        formState={formData}
        onFieldChange={handlers.onFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={handlers.onRemoveFeature}
        onUpdateFeature={handlers.onUpdateFeature}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        onSubmit={handleSubmit}
        isReadOnly={false}
        hideNavigation={true} // Add this prop to hide the navigation in ContentTabContent
      />

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={handlers.currentStep === 0 || isSaving || handlers.isSaving}
          type="button"
          className="flex items-center gap-2"
        >
          Previous
        </Button>
        
        {renderSectionSaveButton()}
        
        <Button
          onClick={handleNext}
          disabled={handlers.currentStep === 3 || isSaving || handlers.isSaving}
          type="button"
          className="flex items-center gap-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
