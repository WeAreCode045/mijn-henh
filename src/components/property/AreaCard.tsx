
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaImageGrid } from "./AreaImageGrid";
import { AreaCardHeader } from "./area/AreaCardHeader";
import { AreaDescription } from "./area/AreaDescription";
import { AreaColumnsSelector } from "./area/AreaColumnsSelector";
import { AreaImageActions } from "./area/AreaImageActions";
import { AreaImageSelectDialog } from "./area/AreaImageSelectDialog";

interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (id: string, imageIds: string[]) => void;
}

export function AreaCard({
  area,
  images,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  // Get area images based on imageIds
  const areaImages = (area.imageIds || [])
    .map(id => images.find(img => img.id === id))
    .filter(Boolean) as PropertyImage[];
  
  console.log(`AreaCard ${area.id} - imageIds:`, area.imageIds);
  console.log(`AreaCard ${area.id} - found images:`, areaImages);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageUpload(area.id, event.target.files);
    }
  };

  const handleUpdateTitle = (value: string) => {
    onUpdate(area.id, "title", value);
  };

  const handleUpdateDescription = (value: string) => {
    onUpdate(area.id, "description", value);
  };

  const handleUpdateColumns = (columns: number) => {
    onUpdate(area.id, "columns", columns);
  };

  const handleUpdateImageIds = (imageIds: string[]) => {
    onUpdate(area.id, "imageIds", imageIds);
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e && e.target) {
        const syntheticEvent = {
          target: e.target as HTMLInputElement
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleFileUpload(syntheticEvent);
      }
    };
    input.click();
  };

  return (
    <Card>
      <AreaCardHeader
        title={area.title}
        areaId={area.id}
        onTitleChange={handleUpdateTitle}
        onRemove={() => onRemove(area.id)}
      />

      <CardContent className="space-y-4">
        <AreaDescription
          description={area.description}
          areaId={area.id}
          onDescriptionChange={handleUpdateDescription}
        />
        
        <AreaColumnsSelector
          columns={area.columns || 2}
          areaId={area.id}
          onColumnsChange={handleUpdateColumns}
        />

        <div>
          <AreaImageActions
            onSelectClick={() => setIsSelectDialogOpen(true)}
            onUploadClick={handleUploadClick}
          />
          
          <AreaImageGrid
            areaImages={areaImages}
            areaId={area.id}
            areaTitle={area.title}
            onImageRemove={onImageRemove}
          />
        </div>
      </CardContent>
      
      <AreaImageSelectDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        images={images}
        areaTitle={area.title}
        selectedImageIds={area.imageIds || []}
        onUpdate={handleUpdateImageIds}
      />
    </Card>
  );
}
