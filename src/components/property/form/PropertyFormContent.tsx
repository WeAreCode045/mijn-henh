import { PropertyArea, PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { AreasStep } from "./steps/AreasStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { ImagesStep } from "./steps/ImagesStep";
import { LocationStep } from "./steps/LocationStep";
import { TechnicalDataStep } from "./steps/TechnicalDataStep";

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
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: (e?: React.MouseEvent) => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleCoverImage?: (url: string) => void;
  isUploading?: boolean;
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
  handleUpdateFloorplan,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  handleSetFeaturedImage,
  handleToggleCoverImage,
  isUploading
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
              handleToggleCoverImage={handleToggleCoverImage}
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
          <form id="imagesForm">
            <ImagesStep
              formData={formData}
              onFieldChange={onFieldChange}
              handleImageUpload={handleImageUpload}
              handleAreaPhotosUpload={handleAreaPhotosUpload}
              handleFloorplanUpload={handleFloorplanUpload}
              handleRemoveImage={handleRemoveImage}
              handleRemoveAreaPhoto={handleRemoveAreaPhoto}
              handleRemoveFloorplan={handleRemoveFloorplan}
              handleSetFeaturedImage={handleSetFeaturedImage}
              handleToggleCoverImage={handleToggleCoverImage}
              isUploading={isUploading}
            />
          </form>
        );
      case 4:
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
      case 5:
        return (
          <form id="locationForm">
            <LocationStep
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchLocationData={onFetchLocationData}
              onRemoveNearbyPlace={onRemoveNearbyPlace}
              handleMapImageDelete={handleMapImageDelete}
            />
          </form>
        );
      case 6:
        return (
          <form id="technicalDataForm">
            <TechnicalDataStep
              formData={formData}
              onFieldChange={onFieldChange}
              onAddTechnicalItem={onAddTechnicalItem}
              onRemoveTechnicalItem={onRemoveTechnicalItem}
              onUpdateTechnicalItem={onUpdateTechnicalItem}
              onFloorplanUpload={handleFloorplanUpload}
              onRemoveFloorplan={handleRemoveFloorplan}
              onUpdateFloorplan={handleUpdateFloorplan}
              isUploading={isUploading}
            />
          </form>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return <div className="mt-6">{renderStep()}</div>;
}
