
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { GeneralPage } from "./pages/GeneralPage";
import { LocationPage } from "./pages/LocationPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { AreasPage } from "./pages/AreasPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    isSaving: boolean;
  };
}

export function ContentRouter({ 
  formData, 
  currentStep, 
  handlers 
}: ContentRouterProps) {
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralPage
            formData={formData}
            onFieldChange={handlers.onFieldChange}
            onSubmit={handlers.onSubmit}
            isSaving={handlers.isSaving}
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
            onSubmit={handlers.onSubmit}
            isSaving={handlers.isSaving}
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
            onSubmit={handlers.onSubmit}
            isSaving={handlers.isSaving}
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
            onAreaImagesSelect={handlers.onAreaImagesSelect}
            onAreaImageUpload={handlers.onAreaImageUpload}
            onSubmit={handlers.onSubmit}
            isSaving={handlers.isSaving}
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
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={handlers.handleStepClick}
        onSave={handlers.onSubmit}
        isSaving={handlers.isSaving}
      />
      <Card>
        <CardHeader>
          <CardTitle>Property Content</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
