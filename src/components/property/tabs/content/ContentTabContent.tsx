
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyContentForm } from "./PropertyContentForm";

interface ContentTabContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleAreaPhotosUpload?: (areaId: string, files: FileList) => void;
  handleImageUpload?: (files: FileList) => void;
  handleRemoveImage?: (imageId: string) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  handleFloorplanUpload?: (files: FileList) => void;
  handleRemoveFloorplan?: (imageId: string) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
}

export function ContentTabContent({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges = () => {},
  handleAreaPhotosUpload,
  handleImageUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage
}: ContentTabContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content</h2>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyContentForm
            formData={formData}
            onFieldChange={onFieldChange}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageUpload={onAreaImageUpload}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onFetchLocationData={onFetchLocationData}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
            step={currentStep}
            handleAreaPhotosUpload={handleAreaPhotosUpload}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
            handleFloorplanUpload={handleFloorplanUpload}
            handleRemoveFloorplan={handleRemoveFloorplan}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleFeaturedImage={handleToggleFeaturedImage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
