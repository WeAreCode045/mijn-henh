
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { PropertyContentForm } from "./content/PropertyContentForm";
import { useState } from "react";

interface PropertyContentTabProps {
  // Changed "property" to "formData" to match what's passed in ContentTabContent.tsx
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
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  // Required navigation props
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  // Added setPendingChanges prop
  setPendingChanges: (pending: boolean) => void;
  isUpdateMode?: boolean;
  onSubmit?: () => void;
  // Add missing image-related props
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
}

export function PropertyContentTab({
  formData,  // Changed from "property" to "formData"
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
  onFetchLocationData,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  setPendingChanges,
  isUpdateMode,
  onSubmit,
  // Add missing props to function parameters
  handleImageUpload,
  handleAreaPhotosUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  isUploading,
  isUploadingFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  handleMapImageDelete
}: PropertyContentTabProps) {
  const [pendingChanges, setPendingChangesInternal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
    if (e.target.files) {
      // Just pass the FileList to the original handler
      onAreaImageUpload("main", e.target.files);
    }
  };

  const handleRemoveImageByIndex = (index: number) => {
    // Convert index to string ID for compatibility
    onAreaImageRemove("main", index.toString());
  };

  const handleFloorplanInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Just pass the FileList to the original handler
      onAreaImageUpload("floorplan", e.target.files);
    }
  };

  const handleRemoveFloorplanByIndex = (index: number) => {
    // Convert index to string ID for compatibility
    onAreaImageRemove("floorplan", index.toString());
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content</h2>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
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
            handleAreaPhotosUpload={handleAreaPhotosUpload || handleAreaImageInputChange}
            handleImageUpload={handleImageUpload || handleImageInputChange}
            handleRemoveImage={handleRemoveImage || handleRemoveImageByIndex}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
            handleFloorplanUpload={handleFloorplanUpload || handleFloorplanInputChange}
            handleRemoveFloorplan={handleRemoveFloorplan || handleRemoveFloorplanByIndex}
            onFetchLocationData={onFetchLocationData}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
            // Pass the required navigation props
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isUploading={isUploading}
            isUploadingFloorplan={isUploadingFloorplan}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleFeaturedImage={handleToggleFeaturedImage}
            handleMapImageDelete={handleMapImageDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
