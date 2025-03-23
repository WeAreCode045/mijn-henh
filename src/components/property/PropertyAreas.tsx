
import { useEffect } from "react";
import { PropertyArea, PropertyImage, PropertyFormData } from "@/types/property";
import { EmptyAreaMessage } from "./EmptyAreaMessage";
import { PropertyAreasHeader } from "./area/PropertyAreasHeader";
import { AreasList } from "./area/AreasList";

interface PropertyAreasProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  propertyId: string;
  formData?: PropertyFormData;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: any, value: any) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
  onImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onAreasGenerated?: (areas: PropertyArea[]) => void;
  isUploading?: boolean;
}

export function PropertyAreas({
  areas = [],
  images = [],
  propertyId,
  formData,
  onAdd,
  onRemove,
  onUpdate,
  onImageRemove,
  onImagesSelect,
  onImageUpload,
  onAreasGenerated,
  isUploading,
}: PropertyAreasProps) {
  useEffect(() => {
    console.log("PropertyAreas - Current areas:", areas);
    console.log("PropertyAreas - Available images:", images);
    console.log("PropertyAreas - Property ID:", propertyId);
    
    // Debug each area's images
    areas.forEach(area => {
      console.log(`Area ${area.id} (${area.title}) - images:`, 
        Array.isArray(area.images) ? area.images : 'Not an array: ' + JSON.stringify(area.images));
    });
  }, [areas, images, propertyId]);

  // Check if areas exist and have valid content
  const hasAreas = Array.isArray(areas) && areas.length > 0;

  const handleAreasGenerated = (newAreas: PropertyArea[]) => {
    if (onAreasGenerated) {
      onAreasGenerated(newAreas);
    }
  };

  return (
    <div className="space-y-4">
      <PropertyAreasHeader 
        onAdd={onAdd} 
        propertyData={formData}
        onAreasGenerated={handleAreasGenerated}
      />

      {!hasAreas ? (
        <EmptyAreaMessage />
      ) : (
        <AreasList
          areas={areas}
          images={images}
          propertyId={propertyId}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onImageRemove={onImageRemove}
          onImagesSelect={onImagesSelect}
        />
      )}
    </div>
  );
}
