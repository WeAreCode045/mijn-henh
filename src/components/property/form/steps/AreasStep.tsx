
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { PropertyFormData } from "@/types/property";

interface AreasStepProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
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
  setPendingChanges
}: AreasStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Areas</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the rooms and areas of this property.
      </p>
      
      <PropertyAreas 
        areas={formData.areas || []}
        images={formData.images || []}
        propertyId={formData.id || ''}
        onAdd={onAddArea}
        onRemove={onRemoveArea}
        onUpdate={onUpdateArea}
        onImageUpload={onAreaImageUpload}
        onImageRemove={onAreaImageRemove}
        onImagesSelect={onAreaImagesSelect}
        isUploading={isUploading}
      />
    </div>
  );
}
