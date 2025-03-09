
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
  onAreaImageUpload: (areaId: string, files: FileList) => void;
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
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
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
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  setPendingChanges,
  handleImageUpload,
  handleRemoveImage,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  isUploadingFloorplan
}: ContentTabContentProps) {
  // Use the location data fetch hook
  const { 
    fetchLocationData,
    generateLocationDescription,
    removeNearbyPlace,
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
        onAreaImageUpload={onAreaImageUpload}
        onAreaImageRemove={onAreaImageRemove}
        onAreaImagesSelect={onAreaImagesSelect}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onFetchLocationData={fetchLocationData}
        onGenerateLocationDescription={generateLocationDescription}
        onRemoveNearbyPlace={removeNearbyPlace}
        isLoadingLocationData={isLoadingLocation}
        setPendingChanges={setPendingChanges}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveFloorplan={handleRemoveFloorplan}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleFeaturedImage={handleToggleFeaturedImage}
        isUploading={isUploading}
        isUploadingFloorplan={isUploadingFloorplan}
      />
    </div>
  );
}
