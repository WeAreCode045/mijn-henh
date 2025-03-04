
import { useState, useEffect } from "react";
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
  const [areaImages, setAreaImages] = useState<PropertyImage[]>([]);
  
  // Get area images based on imageIds whenever area or images change
  useEffect(() => {
    if (area && area.imageIds && images && images.length > 0) {
      console.log(`AreaCard ${area.id} - Finding images for imageIds:`, area.imageIds);
      
      const foundImages = images.filter(img => area.imageIds.includes(img.id));
      
      console.log(`AreaCard ${area.id} - Found ${foundImages.length} images:`, foundImages);
      
      setAreaImages(foundImages);
    } else {
      console.log(`AreaCard ${area.id} - No imageIds or no images available`);
      setAreaImages([]);
    }
  }, [area, area.imageIds, images]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(`AreaCard ${area.id} - Uploading ${event.target.files.length} files`);
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
    console.log(`Updating area ${area.id} image IDs:`, imageIds);
    onUpdate(area.id, "imageIds", imageIds);
    
    // Additional callback for external handling if needed
    if (onImagesSelect) {
      onImagesSelect(area.id, imageIds);
    }
  };

  // Function for upload button click that doesn't require an event parameter
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
