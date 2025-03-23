
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
  isReadOnly?: boolean;
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
  isUploading,
  isReadOnly = false
}: AreasStepProps) {
  // Function to handle generated areas from AI
  const handleAreasGenerated = (newAreas: PropertyArea[]) => {
    if (isReadOnly) return;
    
    // If there are existing areas, we'll append the new ones
    const updatedAreas = [...(formData.areas || []), ...newAreas];
    
    // Update form data with the new areas
    if (setPendingChanges) setPendingChanges(true);
    
    // Replace all areas with our updated list
    newAreas.forEach(area => {
      onAddArea();
    });
    
    // Update each area with the generated content
    updatedAreas.forEach((area, index) => {
      if (index >= (formData.areas?.length || 0)) {
        const newIndex = index - (formData.areas?.length || 0);
        const newAreaId = formData.areas?.[formData.areas.length - newAreas.length + newIndex]?.id;
        
        if (newAreaId) {
          onUpdateArea(newAreaId, 'title', area.title);
          onUpdateArea(newAreaId, 'name', area.name);
          onUpdateArea(newAreaId, 'size', area.size);
          onUpdateArea(newAreaId, 'description', area.description);
        }
      }
    });
  };

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
        formData={formData}
        onAdd={onAddArea}
        onRemove={onRemoveArea}
        onUpdate={onUpdateArea}
        onImageRemove={onAreaImageRemove}
        onImagesSelect={onAreaImagesSelect}
        onImageUpload={onAreaImageUpload}
        onAreasGenerated={handleAreasGenerated}
        isUploading={isUploading}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
