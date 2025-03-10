
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "../PropertyStepContent";

interface ContentTabWrapperProps {
  property: PropertyData;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, data: any) => void;
  onAreaImageRemove: (areaId: string, imageIndex: number) => void;
  onAreaImagesSelect: (areaId: string, images: any[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  isUploading: boolean;
}

export function ContentTabWrapper({
  property,
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  isUploading
}: ContentTabWrapperProps) {
  return (
    <div className="space-y-6">
      <PropertyStepContent
        formData={formData}
        handlers={{
          onFieldChange,
          onAddFeature,
          onRemoveFeature,
          onUpdateFeature,
          onAddArea,
          onRemoveArea,
          onUpdateArea,
          onAreaImageRemove,
          onAreaImagesSelect,
          onAreaImageUpload,
          isUploading
        }}
      />
    </div>
  );
}
