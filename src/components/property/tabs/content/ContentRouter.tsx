
import React, { useEffect, useRef } from "react";
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from "./ContentTabNavigation";
import { GeneralPage } from "./pages/GeneralPage";
import { LocationPage } from "./pages/LocationPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { AreasPage } from "./pages/AreasPage";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [previousStep, setPreviousStep] = React.useState<number | null>(null);

  // Sync URL with current step if they don't match
  useEffect(() => {
    if (id && stepSlug) {
      const stepIndex = contentStepSlugs.indexOf(stepSlug);
      if (stepIndex !== -1 && stepIndex !== currentStep) {
        handlers.handleStepClick(stepIndex);
      }
    }
  }, [stepSlug, currentStep, id, handlers]);

  // Handle step navigation via URLs without auto-saving
  const handleStepNavigation = (step: number) => {
    handlers.handleStepClick(step);
    
    // Navigate to the corresponding URL if needed
    if (id) {
      const targetSlug = contentStepSlugs[step];
      navigate(`/property/${id}/content/${targetSlug}`);
    }
  };

  // Set up a local version of setPendingChanges
  const setPendingChanges = (pending: boolean) => {
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(pending);
    }
  };

  // Field change handler that handles only the changed field
  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    // Call the original handler
    handlers.onFieldChange(field, value);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralPage
            formData={formData}
            onFieldChange={handleFieldChange}
            setPendingChanges={setPendingChanges}
          />
        );
      case 1:
        return (
          <LocationPage
            formData={formData}
            onFieldChange={handleFieldChange}
            onFetchLocationData={handlers.onFetchLocationData}
            onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
            onFetchNearbyCities={handlers.onFetchNearbyCities}
            onGenerateLocationDescription={handlers.onGenerateLocationDescription}
            onGenerateMap={handlers.onGenerateMap}
            isLoadingLocationData={handlers.isLoadingLocationData}
            isGeneratingMap={handlers.isGeneratingMap}
            setPendingChanges={setPendingChanges}
          />
        );
      case 2:
        return (
          <FeaturesPage
            formData={formData}
            onFieldChange={handleFieldChange}
            onAddFeature={handlers.onAddFeature}
            onRemoveFeature={handlers.onRemoveFeature}
            onUpdateFeature={handlers.onUpdateFeature}
            setPendingChanges={setPendingChanges}
          />
        );
      case 3:
        return (
          <AreasPage
            formData={formData}
            onFieldChange={handleFieldChange}
            onAddArea={handlers.onAddArea}
            onRemoveArea={handlers.onRemoveArea}
            onUpdateArea={handlers.onUpdateArea}
            onAreaImageRemove={handlers.onAreaImageRemove}
            onAreaImageUpload={handlers.onAreaImageUpload}
            isUploading={handlers.isUploading}
            setPendingChanges={setPendingChanges}
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
      
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
}
