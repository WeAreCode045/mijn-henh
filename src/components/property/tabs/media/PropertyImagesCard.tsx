
import { PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./images/ImageUploader";
import { SortableImageGrid } from "./images/SortableImageGrid";
import { useSortableImages } from "@/hooks/images/useSortableImages";
import { DragEndEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  setImages: Dispatch<SetStateAction<PropertyImage[]>>;
  propertyId: string;
  onUpload: (files: FileList) => Promise<void>;
  onDelete: (id: string) => void;
  isUploading: boolean;
}

export function PropertyImagesCard({
  images,
  setImages,
  propertyId,
  onUpload,
  onDelete,
  isUploading,
}: PropertyImagesCardProps) {
  const { handleDragEnd, isSavingOrder } = useSortableImages(propertyId);

  const handleDragEndWrapper = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(item => item.id === active.id);
      const newIndex = images.findIndex(item => item.id === over?.id);
      
      const newImages = [...images];
      const [movedItem] = newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, movedItem);
      
      setImages(newImages);
      await handleDragEnd(event);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Property Images</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUploader onUpload={onUpload} isUploading={isUploading} />
        
        {images.length > 0 ? (
          <SortableImageGrid
            items={images}
            onDragEnd={handleDragEndWrapper}
            onDelete={onDelete}
            isSaving={isSavingOrder}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-2">No images yet</p>
            <p className="text-sm text-muted-foreground">
              Upload images to showcase the property
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
