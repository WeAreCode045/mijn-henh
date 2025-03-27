
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
    onAddFeature?: () => void;
    onRemoveFeature?: (id: string) => void;
    onUpdateFeature?: (id: string, description: string) => void;
    onAddArea?: () => void;
    onRemoveArea?: (id: string) => void;
    onUpdateArea?: (id: string, field: any, value: any) => void;
    onAreaImageRemove?: (areaId: string, imageId: string) => void;
    onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
    onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
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
    onSubmit?: () => void;
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
  console.log("ContentRouter - Has formData:", !!formData?.id);
  console.log("ContentRouter - Has onFieldChange:", typeof handlers.onFieldChange === 'function');

  // Create safe handlers with defaults for optional functions
  const safeHandlers = {
    onFieldChange: handlers.onFieldChange || ((field: keyof PropertyFormData, value: any) => {
      console.log("No onFieldChange handler, would set", field, "to", value);
    }),
    onAddFeature: handlers.onAddFeature || (() => console.log("No onAddFeature handler")),
    onRemoveFeature: handlers.onRemoveFeature || ((id: string) => console.log("No onRemoveFeature handler", id)),
    onUpdateFeature: handlers.onUpdateFeature || ((id: string, desc: string) => console.log("No onUpdateFeature handler", id, desc)),
    onAddArea: handlers.onAddArea || (() => console.log("No onAddArea handler")),
    onRemoveArea: handlers.onRemoveArea || ((id: string) => console.log("No onRemoveArea handler", id)),
    onUpdateArea: handlers.onUpdateArea || ((id: string, field: any, value: any) => console.log("No onUpdateArea handler", id, field, value)),
    onAreaImageRemove: handlers.onAreaImageRemove || ((areaId: string, imageId: string) => console.log("No onAreaImageRemove handler", areaId, imageId)),
    onAreaImagesSelect: handlers.onAreaImagesSelect || ((areaId: string, imageIds: string[]) => console.log("No onAreaImagesSelect handler", areaId, imageIds)),
    onAreaImageUpload: handlers.onAreaImageUpload || ((areaId: string, files: FileList) => Promise.resolve(console.log("No onAreaImageUpload handler", areaId))),
    setPendingChanges: handlers.setPendingChanges || ((value: boolean) => console.log("No setPendingChanges handler", value)),
  };

  // Render the appropriate content based on the current step
  switch (currentStep) {
    case 0:
      return (
        <GeneralPage 
          formData={formData} 
          onFieldChange={safeHandlers.onFieldChange}
          setPendingChanges={safeHandlers.setPendingChanges}
        />
      );
    case 1:
      return (
        <LocationPage 
          formData={formData}
          onFieldChange={safeHandlers.onFieldChange}
          onFetchLocationData={handlers.onFetchLocationData}
          onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
          onFetchNearbyCities={handlers.onFetchNearbyCities}
          onGenerateLocationDescription={handlers.onGenerateLocationDescription}
          onGenerateMap={handlers.onGenerateMap}
          onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
          isLoadingLocationData={handlers.isLoadingLocationData}
          isGeneratingMap={handlers.isGeneratingMap}
          setPendingChanges={safeHandlers.setPendingChanges}
        />
      );
    case 2:
      return (
        <FeaturesPage 
          formData={formData}
          onFieldChange={safeHandlers.onFieldChange}
          onAddFeature={safeHandlers.onAddFeature}
          onRemoveFeature={safeHandlers.onRemoveFeature}
          onUpdateFeature={safeHandlers.onUpdateFeature}
          setPendingChanges={safeHandlers.setPendingChanges}
        />
      );
    case 3:
      return (
        <AreasPage 
          formData={formData}
          onFieldChange={safeHandlers.onFieldChange}  
          onAddArea={safeHandlers.onAddArea}
          onRemoveArea={safeHandlers.onRemoveArea}
          onUpdateArea={safeHandlers.onUpdateArea}
          onAreaImageRemove={safeHandlers.onAreaImageRemove}
          onAreaImagesSelect={safeHandlers.onAreaImagesSelect}
          onAreaImageUpload={safeHandlers.onAreaImageUpload}
          isUploading={handlers.isUploading}
          setPendingChanges={safeHandlers.setPendingChanges}
        />
      );
    default:
      return <div>Unknown step: {currentStep}</div>;
  }
}
