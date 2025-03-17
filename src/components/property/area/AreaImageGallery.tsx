
import { useState, useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { AreaImageGrid } from "../AreaImageGrid";
import { AreaImageActions } from "./AreaImageActions";
import { AreaImageSelectDialog } from "./AreaImageSelectDialog";

interface AreaImageGalleryProps {
  areaImages: PropertyImage[];
  allImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
}

export function AreaImageGallery({
  areaImages,
  allImages,
  areaId,
  areaTitle,
  onImageRemove,
  onImagesSelect,
}: AreaImageGalleryProps) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);

  const handleUpdateImageIds = (imageIds: string[]) => {
    console.log(`Updating area ${areaId} image IDs:`, imageIds);
    onImagesSelect(areaId, imageIds);
  };

  return (
    <div>
      <AreaImageActions
        onSelectClick={() => setIsSelectDialogOpen(true)}
      />
      
      <div className="mt-2">
        <p className="text-sm font-medium mb-2">Selected Images ({areaImages.length})</p>
        <AreaImageGrid
          areaImages={areaImages}
          areaId={areaId}
          areaTitle={areaTitle}
          onImageRemove={onImageRemove}
        />
      </div>

      <AreaImageSelectDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        images={allImages}
        areaTitle={areaTitle}
        selectedImageIds={areaImages.map(img => img.id)}
        onUpdate={handleUpdateImageIds}
      />
    </div>
  );
}
