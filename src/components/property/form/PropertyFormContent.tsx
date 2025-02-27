
import type { PropertyFormData } from "@/types/property";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { AreasStep } from "./steps/AreasStep";

interface PropertyFormContentProps {
  step: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyFormData["areas"][0], value: string | string[] | number) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  onAreaImagesSelect?: (id: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete: () => Promise<void>;
}

export function PropertyFormContent({
  step,
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
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
}: PropertyFormContentProps) {

  const renderStepContent = () => {
    switch (step) {
      case 1: // General Info
        return (
          <GeneralInfoStep 
            formData={formData}
            onFieldChange={onFieldChange}
            handleSetFeaturedImage={handleSetFeaturedImage}
          />
        );
      case 2: // Features
        return (
          <FeaturesStep
            features={formData.features}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
          />
        );
      case 3: // Areas
        return (
          <AreasStep
            areas={formData.areas}
            images={formData.images}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageUpload={onAreaImageUpload}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
}
