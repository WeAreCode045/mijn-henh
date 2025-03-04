import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";

interface PropertyContentFormProps {
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
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleCoverImage?: (url: string) => void;
  isUploading?: boolean;
  setPendingChanges: (pending: boolean) => void;
}

export function PropertyContentForm({
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
  isUploading,
  setPendingChanges
}: PropertyContentFormProps) {
  const handleFieldChangeWithTracking = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    setPendingChanges(true);
  };

  const wrappedAddFeature = () => {
    onAddFeature();
    setPendingChanges(true);
  };

  const wrappedRemoveFeature = (id: string) => {
    onRemoveFeature(id);
    setPendingChanges(true);
  };

  const wrappedUpdateFeature = (id: string, description: string) => {
    onUpdateFeature(id, description);
    setPendingChanges(true);
  };

  const wrappedAddArea = () => {
    onAddArea();
    setPendingChanges(true);
  };

  const wrappedRemoveArea = (id: string) => {
    onRemoveArea(id);
    setPendingChanges(true);
  };

  const wrappedUpdateArea = (id: string, field: any, value: any) => {
    onUpdateArea(id, field, value);
    setPendingChanges(true);
  };

  const safeAddTechnicalItem = () => {
    if (onAddTechnicalItem) {
      onAddTechnicalItem();
      setPendingChanges(true);
    }
  };

  const safeRemoveTechnicalItem = (id: string) => {
    if (onRemoveTechnicalItem) {
      onRemoveTechnicalItem(id);
      setPendingChanges(true);
    }
  };

  const safeUpdateTechnicalItem = (id: string, field: keyof PropertyTechnicalItem, value: any) => {
    if (onUpdateTechnicalItem) {
      onUpdateTechnicalItem(id, field, value);
      setPendingChanges(true);
    }
  };

  const safeSetFeaturedImage = (url: string | null) => {
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
      setPendingChanges(true);
    }
  };

  const safeToggleCoverImage = (url: string) => {
    if (handleToggleCoverImage) {
      handleToggleCoverImage(url);
      setPendingChanges(true);
    }
  };

  return (
    <PropertyFormContent
      step={step}
      formData={formData}
      onFieldChange={handleFieldChangeWithTracking}
      onAddFeature={wrappedAddFeature}
      onRemoveFeature={wrappedRemoveFeature}
      onUpdateFeature={wrappedUpdateFeature}
      onAddArea={wrappedAddArea}
      onRemoveArea={wrappedRemoveArea}
      onUpdateArea={wrappedUpdateArea}
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
      onAddTechnicalItem={safeAddTechnicalItem}
      onRemoveTechnicalItem={safeRemoveTechnicalItem}
      onUpdateTechnicalItem={safeUpdateTechnicalItem}
      handleSetFeaturedImage={safeSetFeaturedImage}
      handleToggleCoverImage={safeToggleCoverImage}
      isUploading={isUploading}
    />
  );
}
