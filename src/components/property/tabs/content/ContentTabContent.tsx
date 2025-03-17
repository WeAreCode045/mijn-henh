
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { GeneralInfoForm } from '@/components/property/form/steps/GeneralInfoForm';
import { LocationForm } from '@/components/property/form/steps/LocationForm';
import { FeaturesForm } from '@/components/property/form/steps/FeaturesForm';
import { AreasForm } from '@/components/property/form/steps/AreasForm';
import { useAreaPhotoUploadAdapter } from '@/hooks/images/adapters/useAreaPhotoUploadAdapter';

interface ContentTabContentProps {
  formData: PropertyFormData;
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
  handleNext?: () => void;
  handlePrevious?: () => void;
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
  isUpdateMode?: boolean;
  onSubmit: () => void;
  isSaving?: boolean;
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
  onAreaImageRemove,
  onAreaImagesSelect,
  handleAreaImageUpload,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  setPendingChanges,
  isUploading,
  isUpdateMode = false,
  onSubmit,
  isSaving
}: ContentTabContentProps) {
  // Convert the areaId+files handler to an event-based handler
  const areaImageUploadEventHandler = useAreaPhotoUploadAdapter(handleAreaImageUpload);

  const renderStepForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralInfoForm 
            formData={formData}
            step={currentStep}
            onStepChange={handleStepClick}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
            isSubmitting={isSaving}
          />
        );
      case 1:
        return (
          <LocationForm 
            formData={formData}
            step={currentStep}
            onStepChange={handleStepClick}
            onFieldChange={onFieldChange}
            onFetchLocationData={onFetchLocationData}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onFetchCategoryPlaces={onFetchCategoryPlaces}
            onFetchNearbyCities={onFetchNearbyCities}
            onGenerateMap={onGenerateMap}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            isGeneratingMap={isGeneratingMap}
            onSubmit={onSubmit}
            isSubmitting={isSaving}
          />
        );
      case 2:
        return (
          <FeaturesForm 
            formData={formData}
            step={currentStep}
            onStepChange={handleStepClick}
            onFieldChange={onFieldChange}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onSubmit={onSubmit}
            isSubmitting={isSaving}
          />
        );
      case 3:
        return (
          <AreasForm 
            formData={formData}
            step={currentStep}
            onStepChange={handleStepClick}
            onFieldChange={onFieldChange}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            handleAreaImageUpload={areaImageUploadEventHandler}
            isUploading={isUploading}
            onSubmit={onSubmit}
            isSubmitting={isSaving}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepForm()}
    </div>
  );
}
