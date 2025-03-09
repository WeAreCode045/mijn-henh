
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { PropertyContentForm } from "./content/PropertyContentForm";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { useState } from "react";

interface PropertyContentTabProps {
  property: PropertyFormData;
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
}

export function PropertyContentTab({
  property,
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
}: PropertyContentTabProps) {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Use the step navigation hook
  const { 
    currentStep, 
    handleStepClick, 
    handleNext, 
    handlePrevious 
  } = usePropertyStepNavigation(
    property,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  );

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
            formData={property}
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
            handleAreaPhotosUpload={handleAreaImageInputChange}
            handleImageUpload={handleImageInputChange}
            handleRemoveImage={handleRemoveImageByIndex}
            handleFloorplanUpload={handleFloorplanInputChange}
            handleRemoveFloorplan={handleRemoveFloorplanByIndex}
            onFetchLocationData={onFetchLocationData}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
            // Pass the required navigation props
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </CardContent>
      </Card>
    </div>
  );
}
