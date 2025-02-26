
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { PropertyAreas } from "@/components/property/PropertyAreas";

interface PropertyStepContentProps {
  step: number;
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof any, value: string | string[]) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
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

export function PropertyStepContent({
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
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
}: PropertyStepContentProps) {
  return (
    <div>
      {step === 0 && (
        <PropertyFormContent
          step={step}
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
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImage}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
          handleMapImageDelete={handleMapImageDelete}
        />
      )}
      {step === 1 && (
        <PropertyAreas
          areas={formData.areas}
          images={formData.images}
          onAdd={onAddArea}
          onRemove={onRemoveArea}
          onUpdate={onUpdateArea}
          onImageUpload={onAreaImageUpload}
          onImageRemove={onAreaImageRemove}
        />
      )}
    </div>
  );
}
