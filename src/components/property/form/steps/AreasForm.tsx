
import React from "react";
import { PropertyStepForm } from "../PropertyStepForm";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { normalizeImage } from "@/utils/imageHelpers";
import { ChangeEvent } from "react";

interface AreasFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function AreasForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleAreaImageUpload,
  isUploading = false,
  onSubmit,
  isSubmitting = false
}: AreasFormProps) {
  // Normalize images to ensure they are all PropertyImage objects
  const normalizedImages = Array.isArray(formData.images) 
    ? formData.images.map(img => normalizeImage(img))
    : [];

  return (
    <PropertyStepForm
      formData={formData}
      step={step}
      onStepChange={onStepChange}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting || isUploading}
    >
      <Card>
        <CardContent className="pt-6">
          <PropertyAreas 
            areas={formData.areas || []}
            images={normalizedImages}
            propertyId={formData.id || ''}
            onAdd={onAddArea}
            onRemove={onRemoveArea}
            onUpdate={onUpdateArea}
            onImageRemove={onAreaImageRemove}
            onImagesSelect={onAreaImagesSelect}
            onImageUpload={handleAreaImageUpload}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </PropertyStepForm>
  );
}
