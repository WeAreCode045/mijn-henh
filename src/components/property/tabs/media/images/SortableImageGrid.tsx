
import React, { useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableImageItem } from "./SortableImageItem";
import { useSortableImages } from "@/hooks/images/useSortableImages";

interface SortableImageGridProps {
  images: PropertyImage[];
  onRemoveImage: (index: number) => void;
  onSetFeaturedImage?: (url: string | null) => void;
  onToggleFeaturedImage?: (url: string) => void;
  featuredImage?: string | null;
  featuredImages?: string[];
  propertyId: string;
}

export function SortableImageGrid({ 
  images, 
  onRemoveImage,
  onSetFeaturedImage,
  onToggleFeaturedImage,
  featuredImage,
  featuredImages = [],
  propertyId
}: SortableImageGridProps) {
  const { 
    activeId, 
    sortedImages, 
    isSaving, 
    handleDragStart, 
    handleDragEnd,
    setSortedImages
  } = useSortableImages(images, propertyId);
  
  // Update sortedImages when the images prop changes
  useEffect(() => {
    setSortedImages(images);
  }, [images, setSortedImages]);

  // Modified handlers that don't try to access nativeEvent
  const handleDragStartSafe = (event: DragStartEvent) => {
    // Call the drag start handler directly without trying to access nativeEvent
    handleDragStart(event);
  };

  const handleDragEndSafe = (event: DragEndEvent) => {
    // Call the drag end handler directly without trying to access nativeEvent
    handleDragEnd(event);
  };
  
  return (
    <DndContext 
      id="image-grid-dnd-context"
      onDragStart={handleDragStartSafe}
      onDragEnd={handleDragEndSafe}
    >
      <SortableContext 
        items={sortedImages.map(image => image.id)} 
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => {
            const imageUrl = typeof image === 'string' ? image : image.url;
            const isMain = featuredImage === imageUrl;
            const isFeatured = featuredImages.includes(imageUrl);
            
            return (
              <SortableImageItem
                key={image.id}
                id={image.id}
                isActive={activeId === image.id}
                image={image}
                index={index}
                onRemove={() => onRemoveImage(index)}
                isMain={isMain}
                isFeatured={isFeatured}
                onSetMain={onSetFeaturedImage ? () => onSetFeaturedImage(isMain ? null : imageUrl) : undefined}
                onToggleFeatured={onToggleFeaturedImage ? () => onToggleFeaturedImage(imageUrl) : undefined}
                isUpdating={isSaving}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
