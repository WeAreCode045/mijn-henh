
import { useState, useCallback } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";

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
  
  const { onSubmit } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || (() => {}),
    setLastSaved,
    handlers.onSubmit // Pass the onSubmit from handlers
  );

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit();
  }, [onSubmit]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (handlers.currentStep < 3) {
      handlers.handleStepClick(handlers.currentStep + 1);
    }
  }, [handlers]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (handlers.currentStep > 0) {
      handlers.handleStepClick(handlers.currentStep - 1);
    }
  }, [handlers]);

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={handleSubmit}
        isSaving={handlers.isSaving || false}
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
    </div>
  );
}
