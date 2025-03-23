
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { ContentRouter } from "./ContentRouter";

interface ContentTabWrapperProps {
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
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
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
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ 
  formData, 
  property, 
  handlers 
}: ContentTabWrapperProps) {
  return (
    <div className="space-y-6">
      <ContentRouter
        formData={formData}
        currentStep={handlers.currentStep}
        handlers={{
          ...handlers,
          onAreaImageUpload: handlers.handleAreaImageUpload,
          isSaving: handlers.isSaving || false,
        }}
      />
    </div>
  );
}
