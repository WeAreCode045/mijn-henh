import React from "react";
import { PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "@/components/property/form/PropertyStepContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PropertyContentFormProps {
  formData: PropertyFormData;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: () => void;
    onUpdateArea: (id: string, field: any, value: any) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
  };
}

export function PropertyContentForm({
  formData,
  handlers,
}) {
  const {
    onFieldChange,
    onAddFeature,
    onRemoveFeature,
    onUpdateFeature,
    onAddArea,
    onRemoveArea,
    onUpdateArea,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleAreaImageUpload,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onFetchLocationData,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    setPendingChanges,
    isUploading
  } = handlers;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Content</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyStepContent
            formData={formData}
            step={currentStep}
            onFieldChange={onFieldChange}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            onAreaImageUpload={handleAreaImageUpload}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onFetchLocationData={onFetchLocationData}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
