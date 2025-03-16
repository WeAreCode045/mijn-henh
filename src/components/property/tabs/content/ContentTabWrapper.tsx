
import { useState } from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";

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
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    isSaving?: boolean; // Property to track saving state
  };
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [localIsSaving, setLocalIsSaving] = useState(false);
  
  // Use the contentSubmit hook for handling the submit action
  const { onSubmit } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || (() => {}),
    setLastSaved
  );

  const handleNext = () => {
    // First save the data before moving to the next step
    handleSave().then(success => {
      if (success && handlers.currentStep < 3) {
        handlers.handleStepClick(handlers.currentStep + 1);
      }
    });
  };

  const handlePrevious = () => {
    // First save the data before moving to the previous step
    handleSave().then(success => {
      if (success && handlers.currentStep > 0) {
        handlers.handleStepClick(handlers.currentStep - 1);
      }
    });
  };

  const handleSave = async () => {
    console.log("handleSave called in ContentTabWrapper with formData ID:", formData.id);
    console.log("formData.generalInfo:", formData.generalInfo);
    
    if (!formData.id) {
      console.error("Cannot save: formData.id is missing", formData);
      return false;
    }
    
    setLocalIsSaving(true);
    try {
      const result = await onSubmit();
      console.log("Save result from usePropertyContentSubmit:", result);
      return result;
    } catch (error) {
      console.error("Error during save:", error);
      return false;
    } finally {
      setLocalIsSaving(false);
    }
  };

  // Use the handlers.isSaving if provided, otherwise use localIsSaving
  const isSaving = handlers.isSaving || localIsSaving;

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={handleSave}
        isSaving={isSaving}
      />
      
      <ContentTabContent
        formData={formData}
        onFieldChange={handlers.onFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={handlers.onRemoveFeature}
        onUpdateFeature={handlers.onUpdateFeature}
        onAddArea={handlers.onAddArea}
        onRemoveArea={handlers.onRemoveArea}
        onUpdateArea={handlers.onUpdateArea}
        onAreaImageRemove={handlers.onAreaImageRemove}
        onAreaImagesSelect={handlers.onAreaImagesSelect}
        handleAreaImageUpload={handlers.handleAreaImageUpload}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onFetchLocationData={handlers.onFetchLocationData}
        onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
        isLoadingLocationData={handlers.isLoadingLocationData}
        setPendingChanges={handlers.setPendingChanges}
        isUploading={handlers.isUploading}
        onSubmit={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
