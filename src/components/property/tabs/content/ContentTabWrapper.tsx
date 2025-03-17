
import { useState, useEffect } from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { usePropertyContentAutoSave } from "@/hooks/usePropertyContentAutoSave";

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
  const [pendingChanges, setPendingChangesLocal] = useState(false);
  const [localIsSaving, setLocalIsSaving] = useState(false);
  
  // Use the setPendingChanges from props if available, otherwise use local state
  const setPendingChanges = handlers.setPendingChanges || setPendingChangesLocal;
  
  // Use the auto-save hook
  const { lastSaved, setLastSaved, saveChanges } = usePropertyContentAutoSave(
    formData, 
    pendingChanges, 
    setPendingChanges
  );
  
  // Use the content submit hook for handling the submit action (manual save)
  const { onSubmit } = usePropertyContentSubmit(
    formData,
    setPendingChanges,
    setLastSaved
  );

  const handleNext = () => {
    // First save the data before moving to the next step
    saveChanges().then(() => {
      if (handlers.currentStep < 3) {
        handlers.handleStepClick(handlers.currentStep + 1);
      }
    });
  };

  const handlePrevious = () => {
    // First save the data before moving to the previous step
    saveChanges().then(() => {
      if (handlers.currentStep > 0) {
        handlers.handleStepClick(handlers.currentStep - 1);
      }
    });
  };

  // Manual save function (fallback)
  const handleSave = async () => {
    console.log("handleSave called in ContentTabWrapper with formData ID:", formData.id);
    
    if (!formData.id) {
      console.error("Cannot save: formData.id is missing", formData);
      return false;
    }
    
    setLocalIsSaving(true);
    try {
      return await saveChanges();
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
        setPendingChanges={setPendingChanges}
        isUploading={handlers.isUploading}
        onSubmit={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
