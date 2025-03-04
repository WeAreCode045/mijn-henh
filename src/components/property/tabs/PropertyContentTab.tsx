
import { useState } from "react";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { steps } from "@/components/property/form/formSteps";
import { usePropertyContentAutoSave } from "@/hooks/usePropertyContentAutoSave";
import { usePropertyContentStepNavigation } from "@/hooks/usePropertyContentStepNavigation";
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { PropertyContentForm } from "./content/PropertyContentForm";

interface PropertyContentTabProps {
  formData: PropertyFormData;
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onSubmit?: () => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  isUpdateMode: boolean;
  isUploading?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
}

export function PropertyContentTab({
  formData,
  currentStep: externalCurrentStep,
  handleStepClick: externalHandleStepClick,
  handleNext: externalHandleNext,
  handlePrevious: externalHandlePrevious,
  onSubmit: externalOnSubmit,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  isUpdateMode,
  isUploading,
  handleSetFeaturedImage,
  handleToggleGridImage,
}: PropertyContentTabProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Use the provided step if available, otherwise use internal state
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  // Use the extracted hooks for auto-save, navigation, and submission
  const { lastSaved, setLastSaved } = usePropertyContentAutoSave(
    formData, 
    pendingChanges, 
    setPendingChanges
  );
  
  const { handleStepClick, handleNext, handlePrevious } = usePropertyContentStepNavigation(
    formData,
    currentStep,
    setInternalCurrentStep,
    pendingChanges,
    setPendingChanges,
    setLastSaved,
    externalHandleStepClick,
    externalHandleNext,
    externalHandlePrevious
  );
  
  const { onSubmit } = usePropertyContentSubmit(
    formData,
    setPendingChanges,
    setLastSaved,
    externalOnSubmit
  );

  return (
    <div className="space-y-4">
      <FormStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={onSubmit}
        isUpdateMode={isUpdateMode}
        lastSaved={lastSaved}
      />
      
      <PropertyContentForm
        step={currentStep}
        formData={formData}
        onFieldChange={onFieldChange}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
        onUpdateFeature={onUpdateFeature}
        onAddArea={onAddArea}
        onRemoveArea={onRemoveArea}
        onUpdateArea={onUpdateArea}
        onAreaImageUpload={onAreaImageUpload}
        onAreaImageRemove={onAreaImageRemove}
        onAreaImagesSelect={onAreaImagesSelect}
        handleImageUpload={handleImageUpload}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveImage={handleRemoveImage}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleRemoveFloorplan={handleRemoveFloorplan}
        handleUpdateFloorplan={handleUpdateFloorplan}
        handleMapImageDelete={handleMapImageDelete}
        onFetchLocationData={onFetchLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onAddTechnicalItem={onAddTechnicalItem}
        onRemoveTechnicalItem={onRemoveTechnicalItem}
        onUpdateTechnicalItem={onUpdateTechnicalItem}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleGridImage={handleToggleGridImage}
        isUploading={isUploading}
        setPendingChanges={setPendingChanges}
      />
    </div>
  );
}
