
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
  onImagesReorder: (areaId: string, reorderedImageIds: string[]) => void;
}

export function AreaImageGridSection({
  areaId,
  areaTitle,
  areaImages,
  onSelectClick,
  onImageRemove,
  onImagesReorder
}: AreaImageGridSectionProps) {
  const handleImagesReorder = (areaId: string, reorderedImageIds: string[]) => {
    // Extract just the IDs from the reordered images
    console.log("Reordering images with IDs:", reorderedImageIds);
    
    // Call the parent component's reorder function with the IDs
    onImagesReorder(areaId, reorderedImageIds);
  };

  return (
    <div>
      <AreaImageActions onSelectClick={onSelectClick} />
      
      <div className="mt-2">
        <p className="text-sm font-medium mb-2">Selected Images ({areaImages.length}) - Drag to reorder</p>
        <AreaImageSortableGrid
          areaImages={areaImages}
          areaId={areaId}
          areaTitle={areaTitle}
          onImageRemove={onImageRemove}
          onImagesReorder={handleImagesReorder}
        />
      </div>
    </div>
  );
}
