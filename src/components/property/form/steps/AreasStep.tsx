
import { PropertyAreas } from "@/components/property/PropertyAreas";
import type { PropertyArea, PropertyImage, PropertyFormData } from "@/types/property";

interface AreasStepProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  onAreaImagesSelect?: (id: string, imageIds: string[]) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
}

export function AreasStep({
  formData,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  isUploading,
  setPendingChanges,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto
}: AreasStepProps) {
  console.log("AreasStep rendering with areas:", formData.areas);
  
  const handleAddArea = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onAddArea();
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleRemoveArea = (id: string) => {
    onRemoveArea(id);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleUpdateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number) => {
    onUpdateArea(id, field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <PropertyAreas
      areas={formData.areas || []}
      images={formData.images || []}
      propertyId={formData.id}
      onAdd={handleAddArea}
      onRemove={handleRemoveArea}
      onUpdate={handleUpdateArea}
      onImageUpload={onAreaImageUpload}
      onImageRemove={onAreaImageRemove}
      onImagesSelect={onAreaImagesSelect}
      isUploading={isUploading}
    />
  );
}
