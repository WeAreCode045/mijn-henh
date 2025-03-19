
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';

interface PropertyContentTabProps {
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
    isSaving?: boolean;
  };
}

export function PropertyContentTab({ formData, handlers }: PropertyContentTabProps) {
  return (
    <ContentTabWrapper 
      formData={formData}
      handlers={handlers}
      // Required props with dummy implementations to satisfy type checking
      onFieldChange={(field, value) => handlers.onFieldChange(field, value)}
      onAddFeature={() => handlers.onAddFeature()}
      onRemoveFeature={(id) => handlers.onRemoveFeature(id)}
      onUpdateFeature={(id, desc) => handlers.onUpdateFeature(id, desc)}
      onAddArea={() => handlers.onAddArea()}
      onRemoveArea={(id) => handlers.onRemoveArea(id)}
      onUpdateArea={(id, field, value) => handlers.onUpdateArea(id, field, value)}
      onAreaImageRemove={(areaId, imgId) => handlers.onAreaImageRemove(areaId, imgId)}
      onAreaImagesSelect={(areaId, imgIds) => handlers.onAreaImagesSelect(areaId, imgIds)}
      onAreaImageUpload={(areaId, files) => handlers.handleAreaImageUpload(areaId, files)}
      currentStep={handlers.currentStep}
      handleStepClick={(step) => handlers.handleStepClick(step)}
      onSubmit={() => console.log("Form submitted")}
    />
  );
}
