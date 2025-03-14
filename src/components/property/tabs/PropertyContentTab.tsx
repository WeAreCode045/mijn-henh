
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
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function PropertyContentTab({ formData, handlers }: PropertyContentTabProps) {
  return (
    <ContentTabWrapper 
      formData={formData} 
      handlers={handlers} 
    />
  );
}
