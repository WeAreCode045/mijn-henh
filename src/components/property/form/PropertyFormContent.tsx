
import { PropertyArea, PropertyFeature, PropertyFloorplan, PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { StepRenderer } from "./content/StepRenderer";
import { LoadingState } from "./content/LoadingState";

interface PropertyFormContentProps {
  step: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  isUploading?: boolean;
}

export function PropertyFormContent(props: PropertyFormContentProps) {
  // If formData is not available, show a loading state
  if (!props.formData) {
    return <LoadingState />;
  }

  return (
    <div className="py-4 animate-fadeIn">
      <StepRenderer 
        step={props.step}
        formData={props.formData}
        onFieldChange={props.onFieldChange}
        onAddFeature={props.onAddFeature}
        onRemoveFeature={props.onRemoveFeature}
        onUpdateFeature={props.onUpdateFeature}
        onAddArea={props.onAddArea}
        onRemoveArea={props.onRemoveArea}
        onUpdateArea={props.onUpdateArea}
        onAreaImageUpload={props.onAreaImageUpload}
        onAreaImageRemove={props.onAreaImageRemove}
        onAreaImagesSelect={props.onAreaImagesSelect}
        handleImageUpload={props.handleImageUpload}
        handleAreaPhotosUpload={props.handleAreaPhotosUpload}
        handleFloorplanUpload={props.handleFloorplanUpload}
        handleRemoveImage={props.handleRemoveImage}
        handleRemoveAreaPhoto={props.handleRemoveAreaPhoto}
        handleRemoveFloorplan={props.handleRemoveFloorplan}
        handleUpdateFloorplan={props.handleUpdateFloorplan}
        handleSetFeaturedImage={props.handleSetFeaturedImage}
        handleToggleGridImage={props.handleToggleGridImage}
        handleMapImageDelete={props.handleMapImageDelete}
        onFetchLocationData={props.onFetchLocationData}
        onRemoveNearbyPlace={props.onRemoveNearbyPlace}
        onAddTechnicalItem={props.onAddTechnicalItem}
        onRemoveTechnicalItem={props.onRemoveTechnicalItem}
        onUpdateTechnicalItem={props.onUpdateTechnicalItem}
        isUploading={props.isUploading}
      />
    </div>
  );
}
