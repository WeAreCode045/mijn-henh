
import { PropertyImage } from "@/types/property";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableImageItem } from "./SortableImageItem";

interface SortableImageGridProps {
  images: PropertyImage[];
  onRemoveImage: (index: number) => void;
  handleSetFeatured?: (e: React.MouseEvent, url: string) => void;
  handleToggleFeatured?: (e: React.MouseEvent, url: string) => void;
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  onDragEnd: any; // Use the DragEndEvent type here
}

export function SortableImageGrid({
  images,
  onRemoveImage,
  handleSetFeatured,
  handleToggleFeatured,
  featuredImageUrl,
  featuredImageUrls = [],
  onDragEnd
}: SortableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!images || images.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-gray-500">
        No images uploaded yet. Click "Upload Images" to add images.
      </div>
    );
  }
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={images.map(image => image.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <SortableImageItem
              key={image.id || index}
              id={image.id}
              url={image.url}
              onRemove={() => onRemoveImage(index)}
              isFeatured={image.url === featuredImageUrl}
              onSetFeatured={handleSetFeatured ? (e) => handleSetFeatured(e, image.url) : undefined}
              isInFeatured={featuredImageUrls.includes(image.url)}
              onToggleFeatured={handleToggleFeatured ? (e) => handleToggleFeatured(e, image.url) : undefined}
              sort_order={image.sort_order}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
