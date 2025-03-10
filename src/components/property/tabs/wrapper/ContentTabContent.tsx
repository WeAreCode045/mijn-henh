
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyContentTab } from "../PropertyContentTab";

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
          <PropertyContentTab
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
            handleImageUpload={handleImageInputChange}
            handleAreaPhotosUpload={handleAreaImageInputChange}
            handleRemoveImage={handleRemoveImageByIndex}
            handleFloorplanUpload={handleFloorplanInputChange}
            handleRemoveFloorplan={handleRemoveFloorplanByIndex}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onFetchLocationData={onFetchLocationData}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
            isUpdateMode={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
