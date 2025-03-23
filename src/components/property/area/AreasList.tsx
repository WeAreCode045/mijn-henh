
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaCard } from "../AreaCard";

interface AreasListProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  propertyId: string;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: any, value: any) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
  isReadOnly?: boolean;
}

export function AreasList({
  areas,
  images,
  propertyId,
  onRemove,
  onUpdate,
  onImageRemove,
  onImagesSelect,
  isReadOnly = false
}: AreasListProps) {
  // Make sure all areas have images as arrays
  const normalizedAreas = areas.map(area => ({
    ...area,
    images: Array.isArray(area.images) ? area.images : []
  }));

  return (
    <div className="space-y-6">
      {normalizedAreas.map((area, index) => (
        <AreaCard
          key={area.id}
          area={area}
          images={images}
          propertyId={propertyId}
          isFirstArea={index === 0}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onImageRemove={onImageRemove}
          onImagesSelect={onImagesSelect}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
}
