
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { PropertyFormData, PropertyArea, PropertyImage } from "@/types/property";

interface AreasStepProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
}

export function AreasStep({
  formData,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  setPendingChanges,
  isUploading
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
        onImageRemove={onAreaImageRemove}
        onImagesSelect={onAreaImagesSelect}
        onImageUpload={onAreaImageUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
