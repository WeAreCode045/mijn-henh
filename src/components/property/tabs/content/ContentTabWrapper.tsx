import { useState } from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";

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

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { onSubmit } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || (() => {}),
    setLastSaved,
    handlers.onSubmit
  );

  const handleNext = () => {
    if (handlers.currentStep < 3) {
      handlers.handleStepClick(handlers.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (handlers.currentStep > 0) {
      handlers.handleStepClick(handlers.currentStep - 1);
    }
  };

  const adaptedRemoveFeature = (id: string) => {
    handlers.onRemoveFeature(id);
  };
  
  const adaptedUpdateFeature = (id: string, description: string) => {
    handlers.onUpdateFeature(id, description);
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={onSubmit}
        isSaving={handlers.isSaving || false}
      />
      
      <ContentTabContent
        formData={formData}
        onFieldChange={handlers.onFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={adaptedRemoveFeature}
        onUpdateFeature={adaptedUpdateFeature}
        onAddArea={handlers.onAddArea}
        onRemoveArea={handlers.onRemoveArea}
        onUpdateArea={handlers.onUpdateArea}
        onAreaImageRemove={handlers.onAreaImageRemove}
        onAreaImagesSelect={handlers.onAreaImagesSelect}
        handleAreaImageUpload={handlers.handleAreaImageUpload}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onFetchLocationData={handlers.onFetchLocationData}
        onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
        isLoadingLocationData={handlers.isLoadingLocationData}
        setPendingChanges={handlers.setPendingChanges}
        isUploading={handlers.isUploading}
        onSubmit={onSubmit}
        isSaving={handlers.isSaving}
      />
    </div>
  );
}
