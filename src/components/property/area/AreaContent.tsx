
import { PropertyArea, PropertyImage } from "@/types/property";
import { CardContent } from "@/components/ui/card";
import { AreaDescription } from "./AreaDescription";
import { AreaColumnsSelector } from "./AreaColumnsSelector";
import { AreaImageGallery } from "./AreaImageGallery";

interface AreaContentProps {
  area: PropertyArea;
  areaImages: PropertyImage[];
  allImages: PropertyImage[];
  onUpdateDescription: (value: string) => void;
  onUpdateColumns: (columns: number) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
}

export function AreaContent({
  area,
  areaImages,
  allImages,
  onUpdateDescription,
  onUpdateColumns,
  onImageRemove,
  onImagesSelect
}: AreaContentProps) {
  return (
    <CardContent className="space-y-4">
      <AreaDescription
        description={area.description}
        areaId={area.id}
        onDescriptionChange={onUpdateDescription}
      />
      
      <AreaColumnsSelector
        columns={area.columns || 2}
        areaId={area.id}
        onColumnsChange={onUpdateColumns}
      />

      <AreaImageGallery
        areaImages={areaImages}
        allImages={allImages}
        areaId={area.id}
        areaTitle={area.title}
        onImageRemove={onImageRemove}
        onImagesSelect={onImagesSelect}
      />
    </CardContent>
  );
}
