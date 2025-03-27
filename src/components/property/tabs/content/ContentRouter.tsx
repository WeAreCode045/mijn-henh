
import React from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { GeneralPage } from './pages/GeneralPage';
import { LocationPage } from './pages/LocationPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AreasPage } from './pages/AreasPage';

interface ContentRouterProps {
  formData: PropertyFormData;
  property: PropertyData;
  currentStep: number;
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
    onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
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
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function ContentRouter({ formData, property, currentStep, handlers }: ContentRouterProps) {
  // Ensure we have valid data to work with
  if (!formData) {
    console.error("ContentRouter - No form data provided");
    return <div>Error: No form data available</div>;
  }

  // Log to help with debugging
  console.log("ContentRouter - Current step:", currentStep);
  console.log("ContentRouter - Has property data:", !!property?.id);

  // Render the appropriate content based on the current step
  switch (currentStep) {
    case 0:
      return (
        <GeneralPage 
          formData={formData} 
          onFieldChange={handlers.onFieldChange}
          setPendingChanges={handlers.setPendingChanges}
        />
      );
    case 1:
      return (
        <LocationPage 
          formData={formData}
          onFieldChange={handlers.onFieldChange}
          onFetchLocationData={handlers.onFetchLocationData}
          onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
          onFetchNearbyCities={handlers.onFetchNearbyCities}
          onGenerateLocationDescription={handlers.onGenerateLocationDescription}
          onGenerateMap={handlers.onGenerateMap}
          onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
          isLoadingLocationData={handlers.isLoadingLocationData}
          isGeneratingMap={handlers.isGeneratingMap}
          setPendingChanges={handlers.setPendingChanges}
        />
      );
    case 2:
      return (
        <FeaturesPage 
          formData={formData}
          onFieldChange={handlers.onFieldChange}
          onAddFeature={handlers.onAddFeature}
          onRemoveFeature={handlers.onRemoveFeature}
          onUpdateFeature={handlers.onUpdateFeature}
          setPendingChanges={handlers.setPendingChanges}
        />
      );
    case 3:
      return (
        <AreasPage 
          formData={formData}
          onAddArea={handlers.onAddArea}
          onRemoveArea={handlers.onRemoveArea}
          onUpdateArea={handlers.onUpdateArea}
          onAreaImageRemove={handlers.onAreaImageRemove}
          onAreaImagesSelect={handlers.onAreaImagesSelect}
          onAreaImageUpload={handlers.onAreaImageUpload}
          isUploading={handlers.isUploading}
          setPendingChanges={handlers.setPendingChanges}
        />
      );
    default:
      return <div>Unknown step: {currentStep}</div>;
  }
}
