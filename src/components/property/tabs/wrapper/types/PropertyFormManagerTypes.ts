
import { PropertyData, PropertyFormData, PropertyTechnicalItem } from "@/types/property";

export interface PropertyFormManagerProps {
  property: PropertyData;
  children: (props: PropertyFormManagerChildrenProps) => React.ReactNode;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyData, value: any) => void;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  addTechnicalItem: () => void;
  removeTechnicalItem: (id: string) => void;
  updateTechnicalItem: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: any, value: any) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => void;
  handleAreaImageRemove: (areaId: string, imageId: string) => void;
  handleAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan: (index: number, field: any, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleCoverImage: (url: string) => void;
  onSubmit: () => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  propertyWithRequiredProps: PropertyData;
  lastSaved: Date | null;
  isSaving: boolean;
}
