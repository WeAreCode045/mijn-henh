
import React from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';

interface PropertyContentTabProps {
  formData: PropertyFormData;
  property: PropertyData; 
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
    onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
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

export function PropertyContentTab({ formData, property, handlers }: PropertyContentTabProps) {
  // Ensure all necessary props are passed to ContentTabWrapper
  const completeHandlers = {
    ...handlers,
    // Make sure onAreaImageUpload exists or use handleAreaImageUpload as fallback
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload
  };

  return (
    <ContentTabWrapper 
      formData={formData}
      property={property} 
      handlers={completeHandlers} 
    />
  );
}
