
import React, { useState, useEffect } from "react";
import { PropertyFormData, PropertyArea } from "@/types/property";
import { PropertyStepForm } from "@/components/property/form/PropertyStepForm";
import { GeneralInfoContent } from "../../form/steps/general-info/GeneralInfoContent";
import { LocationContent } from "../../form/steps/location/LocationContent";
import { FeaturesContent } from "../../form/steps/features/FeaturesContent";
import { AreasContent } from "../../form/steps/areas/AreasContent";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
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
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
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
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  // Use the passed currentStep from handlers, or fallback to local state
  const [localStep, setLocalStep] = useState<number>(0);
  
  // Use either the handler's currentStep or the local step
  const currentStep = handlers.currentStep !== undefined ? handlers.currentStep : localStep;
  
  // Create a step change handler that works with either the handler's or local state
  const handleStepChange = (step: number) => {
    console.log(`Changing step to: ${step}`);
    if (handlers.handleStepClick) {
      handlers.handleStepClick(step);
    } else {
      setLocalStep(step);
    }
    
    // Mark that there are pending changes when navigating between steps
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    }
  };

  // Log the current form data for debugging
  useEffect(() => {
    console.log("ContentTabWrapper - Form data:", formData);
    console.log("ContentTabWrapper - Current step:", currentStep);
  }, [formData, currentStep]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Content</h2>
      
      <PropertyStepForm
        formData={formData}
        step={currentStep}
        onStepChange={handleStepChange}
        onFieldChange={handlers.onFieldChange}
      >
        {currentStep === 0 && (
          <GeneralInfoContent
            formData={formData}
            onFieldChange={handlers.onFieldChange}
          />
        )}
        
        {currentStep === 1 && (
          <LocationContent
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
          />
        )}
        
        {currentStep === 2 && (
          <FeaturesContent
            features={formData.features || []}
            onAddFeature={handlers.onAddFeature}
            onRemoveFeature={handlers.onRemoveFeature}
            onUpdateFeature={handlers.onUpdateFeature}
          />
        )}
        
        {currentStep === 3 && (
          <AreasContent
            areas={formData.areas || []}
            onAddArea={handlers.onAddArea}
            onRemoveArea={handlers.onRemoveArea}
            onUpdateArea={handlers.onUpdateArea}
            onAreaImageRemove={handlers.onAreaImageRemove}
            onAreaImagesSelect={handlers.onAreaImagesSelect}
            onAreaImageUpload={handlers.handleAreaImageUpload}
            images={formData.images || []}
            isUploading={handlers.isUploading || false}
          />
        )}
      </PropertyStepForm>
    </div>
  );
}
