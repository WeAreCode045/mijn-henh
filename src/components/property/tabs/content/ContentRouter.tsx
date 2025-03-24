
import React, { useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from "./ContentTabNavigation";
import { GeneralPage } from "./pages/GeneralPage";
import { LocationPage } from "./pages/LocationPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { AreasPage } from "./pages/AreasPage";
import { Card, CardContent } from "@/components/ui/card";
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
  const [hasPendingChanges, setHasPendingChanges] = React.useState(false);
  const [lastFormState, setLastFormState] = React.useState<PropertyFormData | null>(null);
  const [previousStep, setPreviousStep] = React.useState<number | null>(null);

  // Track form changes
  useEffect(() => {
    if (lastFormState && JSON.stringify(lastFormState) !== JSON.stringify(formData)) {
      setHasPendingChanges(true);
    }
    
    // Update the last form state
    setLastFormState(formData);
  }, [formData, lastFormState]);

  // Save changes when current step changes (navigating between tabs)
  useEffect(() => {
    if (previousStep !== null && previousStep !== currentStep && hasPendingChanges) {
      saveChanges();
    }
    setPreviousStep(currentStep);
  }, [currentStep]);

  // Save changes when navigating away
  const saveChanges = async () => {
    if (!hasPendingChanges || !formData.id) return;
    
    try {
      console.log("Saving property changes...");
      
      // Only save relevant fields to avoid overwriting data we don't have
      const updateData = {
        title: formData.title,
        price: formData.price,
        address: formData.address,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        livingArea: formData.livingArea,
        buildYear: formData.buildYear,
        garages: formData.garages,
        energyLabel: formData.energyLabel,
        hasGarden: formData.hasGarden,
        description: formData.description,
        shortDescription: formData.shortDescription,
        propertyType: formData.propertyType
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', formData.id);
      
      if (error) throw error;
      
      setHasPendingChanges(false);
      
      // Don't show a success toast to avoid too many notifications
      console.log("Property saved successfully");
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property changes",
        variant: "destructive",
      });
    }
  };

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
  const handleStepNavigation = async (step: number) => {
    // Save changes before navigating
    await saveChanges();
    
    // Call the original handler 
    handlers.handleStepClick(step);
    
    // Navigate to the corresponding URL if needed
    if (id) {
      const targetSlug = contentStepSlugs[step];
      navigate(`/property/${id}/content/${targetSlug}`);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await saveChanges();
  };

  // Set up a local version of setPendingChanges
  const setPendingChanges = (pending: boolean) => {
    setHasPendingChanges(pending);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(pending);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralPage
            formData={formData}
            onFieldChange={handlers.onFieldChange}
            setPendingChanges={setPendingChanges}
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
            isLoadingLocationData={handlers.isLoadingLocationData}
            isGeneratingMap={handlers.isGeneratingMap}
            setPendingChanges={setPendingChanges}
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
            setPendingChanges={setPendingChanges}
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
      <form onSubmit={handleFormSubmit}>
        <Card>
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
