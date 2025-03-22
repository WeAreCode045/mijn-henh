
import { useState } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { useToast } from "@/components/ui/use-toast";

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
    handleNext?: () => void;
    handlePrevious?: () => void;
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
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const { toast } = useToast();
  
  const { onSubmit, isSaving } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || setPendingChanges,
    setLastSaved,
    handlers.onSubmit
  );

  const adaptedRemoveFeature = (id: string) => {
    handlers.onRemoveFeature(id);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };
  
  const adaptedUpdateFeature = (id: string, description: string) => {
    handlers.onUpdateFeature(id, description);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };
  
  const adaptedFieldChange = (field: keyof PropertyFormData, value: any) => {
    handlers.onFieldChange(field, value);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={onSubmit}
        isSaving={isSaving || handlers.isSaving || false}
      />
      
      <ContentTabContent
        property={property} 
        formState={formData}
        onFieldChange={adaptedFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={adaptedRemoveFeature}
        onUpdateFeature={adaptedUpdateFeature}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        onSubmit={onSubmit}
        isReadOnly={false}
        hideNavigation={true}
      />
    </div>
  );
}
