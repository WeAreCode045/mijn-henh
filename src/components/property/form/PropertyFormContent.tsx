
import { PropertyFormData } from "@/types/property";
import { AreasStep } from "./steps/AreasStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { LocationStep } from "./steps/LocationStep";

interface PropertyFormContentProps {
  step: number;
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
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
  setPendingChanges?: (changes: boolean) => void;
  isLoadingLocationData?: boolean;
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
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  isUploadingFloorplan,
  setPendingChanges,
  isLoadingLocationData
}: PropertyFormContentProps) {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form id="generalInfoForm">
            <GeneralInfoStep
              formData={formData}
              onFieldChange={onFieldChange}
              handleSetFeaturedImage={handleSetFeaturedImage}
              handleToggleFeaturedImage={handleToggleFeaturedImage}
              isUploading={isUploading}
            />
          </form>
        );
      case 2:
        return (
          <form id="featuresForm">
            <FeaturesStep
              features={formData.features || []}
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onUpdateFeature={onUpdateFeature}
            />
          </form>
        );
      case 3:
        return (
          <form id="areasForm">
            <AreasStep
              areas={formData.areas || []}
              images={formData.images || []}
              propertyId={formData.id}
              onAddArea={onAddArea}
              onRemoveArea={onRemoveArea}
              onUpdateArea={onUpdateArea}
              onAreaImageUpload={onAreaImageUpload}
              onAreaImageRemove={onAreaImageRemove}
              onAreaImagesSelect={onAreaImagesSelect}
              isUploading={isUploading}
            />
          </form>
        );
      case 4:
        return (
          <form id="locationForm">
            <LocationStep
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchLocationData={onFetchLocationData}
              onRemoveNearbyPlace={onRemoveNearbyPlace}
              handleMapImageDelete={handleMapImageDelete}
              isLoadingLocationData={isLoadingLocationData}
            />
          </form>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return <div className="mt-6">{renderStep()}</div>;
}
