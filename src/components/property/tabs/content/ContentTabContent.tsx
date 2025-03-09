
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyContentForm } from "./PropertyContentForm";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { steps } from "@/components/property/form/formSteps";

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
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
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
  handleImageUpload,
  handleRemoveImage,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  isUploadingFloorplan,
}: ContentTabContentProps) {
  
  // Create wrapper functions to handle type mismatches
  const handleAreaImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // We need to extract the area ID from a data attribute or similar
      const areaId = e.target.getAttribute('data-area-id');
      if (areaId) {
        onAreaImageUpload(areaId, e.target.files);
      }
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleImageUpload) {
      handleImageUpload(e);
    }
  };

  const handleRemoveImageByIndex = (index: number) => {
    if (handleRemoveImage) {
      handleRemoveImage(index);
    }
  };

  const handleFloorplanInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleFloorplanUpload) {
      handleFloorplanUpload(e);
    }
  };

  const handleRemoveFloorplanByIndex = (index: number) => {
    if (handleRemoveFloorplan) {
      handleRemoveFloorplan(index);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content</h2>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Pass all required navigation props to FormStepNavigation */}
          <FormStepNavigation 
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
          
          <PropertyContentForm
            step={currentStep}
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
            // Pass adapter functions for type compatibility
            handleAreaPhotosUpload={handleAreaImageInputChange}
            handleImageUpload={handleImageInputChange}
            handleRemoveImage={handleRemoveImageByIndex}
            handleFloorplanUpload={handleFloorplanInputChange}
            handleRemoveFloorplan={handleRemoveFloorplanByIndex}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleFeaturedImage={handleToggleFeaturedImage}
            isUploading={isUploading}
            isUploadingFloorplan={isUploadingFloorplan}
          />
        </CardContent>
      </Card>
    </div>
  );
}
