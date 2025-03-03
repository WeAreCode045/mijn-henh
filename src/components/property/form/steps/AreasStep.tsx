
import { PropertyAreas } from "@/components/property/PropertyAreas";
import type { PropertyArea, PropertyImage } from "@/types/property";

interface AreasStepProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  onAreaImagesSelect?: (id: string, imageIds: string[]) => void;
}

export function AreasStep({
  areas,
  images,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
}: AreasStepProps) {
  console.log("AreasStep rendering with areas:", areas);
  console.log("AreasStep images:", images);
  
  const handleAddArea = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onAddArea();
  };
  
  return (
    <PropertyAreas
      areas={areas || []}
      images={images || []}
      onAdd={handleAddArea}
      onRemove={onRemoveArea}
      onUpdate={onUpdateArea}
      onImageUpload={onAreaImageUpload}
      onImageRemove={onAreaImageRemove}
      onImagesSelect={onAreaImagesSelect}
    />
  );
}
