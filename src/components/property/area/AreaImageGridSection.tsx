
import { Label } from "@/components/ui/label";
import { PropertyImage } from "@/types/property";
import { AreaImageActions } from "./AreaImageActions";
import { AreaImageSortableGrid } from "./AreaImageSortableGrid";

interface AreaImageGridSectionProps {
  areaId: string;
  areaTitle: string;
  areaImages: PropertyImage[];
  onSelectClick: () => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesReorder: (areaId: string, reorderedImages: PropertyImage[]) => void;
  isReadOnly?: boolean;
}

export function AreaImageGridSection({
  areaId,
  areaTitle,
  areaImages,
  onSelectClick,
  onImageRemove,
  onImagesReorder,
  isReadOnly = false
}: AreaImageGridSectionProps) {
  return (
    <div>
      <AreaImageActions 
        onSelectClick={onSelectClick} 
        isReadOnly={isReadOnly}
      />
      
      <div className="mt-2">
        <p className="text-sm font-medium mb-2">Selected Images ({areaImages.length}) - Drag to reorder</p>
        <AreaImageSortableGrid
          areaImages={areaImages}
          areaId={areaId}
          areaTitle={areaTitle}
          onImageRemove={onImageRemove}
          onImagesReorder={onImagesReorder}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
