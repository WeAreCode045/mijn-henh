
import React, { useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from "./ContentTabNavigation";
import { GeneralPage } from "./pages/GeneralPage";
import { LocationPage } from "./pages/LocationPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { AreasPage } from "./pages/AreasPage";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";

interface ContentRouterProps {
  formData: PropertyFormData;
  currentStep: number;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: string, value: any) => void;
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
    isSaving: boolean; // This is required
  };
}

// Available content step slugs
const contentStepSlugs = ['general', 'location', 'features', 'areas'];

export function ContentRouter({ 
  formData, 
  currentStep, 
  handlers 
}: ContentRouterProps) {
  const { id, step: stepSlug } = useParams();
  const navigate = useNavigate();

  // Sync URL with current step if they don't match
  useEffect(() => {
    if (id && stepSlug) {
      const stepIndex = contentStepSlugs.indexOf(stepSlug);
      if (stepIndex !== -1 && stepIndex !== currentStep) {
        handlers.handleStepClick(stepIndex);
      }
    }
  }, [stepSlug, currentStep, id, handlers]);

  // Handle step navigation via URLs
  const handleStepNavigation = (step: number) => {
    // First call the original handler to ensure data is saved
    handlers.handleStepClick(step);
  };

  const renderContent = () => {
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
            onGenerateLocationDescription={handlers.onGenerateLocationDescription}
            isLoadingLocationData={handlers.isLoadingLocationData}
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
            onFieldChange={handlers.onFieldChange}
            onAddArea={handlers.onAddArea}
            onRemoveArea={handlers.onRemoveArea}
            onUpdateArea={handlers.onUpdateArea}
            onAreaImageRemove={handlers.onAreaImageRemove}
            onAreaImageUpload={handlers.onAreaImageUpload}
            isUploading={handlers.isUploading}
            setPendingChanges={handlers.setPendingChanges}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation
        currentStep={currentStep}
        onStepClick={handleStepNavigation}
        contentStepSlugs={contentStepSlugs}
        propertyId={id}
      />
      <Card>
        <CardContent className="pt-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
