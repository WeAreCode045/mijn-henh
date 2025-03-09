
// Import necessary types but exclude the deleted TechnicalItemTypes
import { PropertyFormData } from "../property";
import { PropertyArea } from "./PropertyAreaTypes";
import { PropertyFeature } from "./PropertyFeatureTypes";
import { PropertyNearbyPlace } from "./PropertyNearbyPlaceTypes";

// Define specific form manager and component types without technicalItems references
export interface PropertyFormManagerProps {
  property: {
    id: string;
    [key: string]: any;
  };
  children: (props: PropertyFormManagerChildrenProps) => React.ReactNode;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSaveObjectId: (objectId: string) => string;
  handleSaveAgent: (agentId: string) => string;
  handleSaveTemplate: (templateId: string) => string;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: keyof PropertyArea, value: any) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => void;
  handleAreaImageRemove: (areaId: string, imageId: string) => void;
  handleAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleFeaturedImage: (url: string) => void;
  onSubmit: () => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  propertyWithRequiredProps: PropertyFormData & { id: string };
  lastSaved?: string;
  isSaving?: boolean;
}
