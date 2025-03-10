
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { PropertyFormData, PropertyArea, PropertyImage } from "@/types/property";

interface AreasStepProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  setPendingChanges?: (pending: boolean) => void;
  // Add missing properties based on the errors
  areas?: PropertyArea[];
  images?: PropertyImage[];
  propertyId?: string;
  onAreaImageUpload?: (areaId: string, files: FileList) => void;
}

export function AreasStep({
  formData,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
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
        onImageRemove={onAreaImageRemove}
        onImagesSelect={onAreaImagesSelect}
      />
    </div>
  );
}
