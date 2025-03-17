
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { PropertyFormData, PropertyArea, PropertyImage } from "@/types/property";
import { normalizeImage } from "@/utils/imageHelpers";
import { ChangeEvent } from "react";
import { useReverseAreaPhotoUploadAdapter } from "@/hooks/images/adapters/useAreaPhotoUploadAdapter";

interface AreasStepProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
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
  // Normalize images to ensure they are all PropertyImage objects
  const normalizedImages = Array.isArray(formData.images) 
    ? formData.images.map(img => normalizeImage(img))
    : [];

  // Create an adapter to convert event-based handlers to areaId+files parameters
  const handleAreaImageUploadAdapted = useReverseAreaPhotoUploadAdapter(onAreaImageUpload);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Areas</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the rooms and areas of this property.
      </p>
      
      <PropertyAreas 
        areas={formData.areas || []}
        images={normalizedImages}
        propertyId={formData.id || ''}
        onAdd={onAddArea}
        onRemove={onRemoveArea}
        onUpdate={onUpdateArea}
        onImageRemove={onAreaImageRemove}
        onImagesSelect={onAreaImagesSelect}
        onImageUpload={onAreaImageUpload}
        handleAreaImageUpload={handleAreaImageUploadAdapted}
        isUploading={isUploading}
      />
    </div>
  );
}
