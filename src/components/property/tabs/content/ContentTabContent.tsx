
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "@/components/property/form/PropertyStepContent";
import { useLocationDataFetch } from "@/hooks/useLocationDataFetch";

interface ContentTabContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function ContentTabContent({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges
}: ContentTabContentProps) {
  // Use the location data fetch hook
  const { 
    generateLocationDescription,
    isLoading: isLoadingLocation
  } = useLocationDataFetch(formData, onFieldChange);

  return (
    <div className="space-y-6">
      <PropertyStepContent
        formData={formData}
        onFieldChange={onFieldChange}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
        onUpdateFeature={onUpdateFeature}
        onAddArea={onAddArea}
        onRemoveArea={onRemoveArea}
        onUpdateArea={onUpdateArea}
        onAreaImageRemove={onAreaImageRemove}
        onAreaImagesSelect={onAreaImagesSelect}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onFetchLocationData={onFetchLocationData}
        onGenerateLocationDescription={generateLocationDescription}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        isLoadingLocationData={isLoadingLocation || isLoadingLocationData}
        setPendingChanges={setPendingChanges}
      />
    </div>
  );
}
