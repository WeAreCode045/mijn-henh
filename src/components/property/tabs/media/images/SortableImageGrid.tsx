
import React, { useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableImageItem } from "./SortableImageItem";
import { useSortableImages } from "@/hooks/images/useSortableImages";
import { toast } from "sonner";

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
  
  useEffect(() => {
    setSortedImages(images);
  }, [images, setSortedImages]);

  const handleDragStartSafe = (event: DragStartEvent) => {
    handleDragStart(event);
  };

  const handleDragEndSafe = (event: DragEndEvent) => {
    handleDragEnd(event);
  };
  
  const handleSetMain = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onSetFeaturedImage) {
      if (featuredImage === imageUrl) return;
      
      onSetFeaturedImage(imageUrl);
    }
  };
  
  const handleToggleFeatured = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onToggleFeaturedImage) return;
    
    const isFeatured = featuredImages.includes(imageUrl);
    if (isFeatured) {
      onToggleFeaturedImage(imageUrl);
      return;
    }
    
    if (featuredImages.length >= 4) {
      toast.warning("Maximum of 4 featured images allowed. Please remove one first.");
      return;
    }
    
    onToggleFeaturedImage(imageUrl);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                onSetMain={onSetFeaturedImage ? (e) => handleSetMain(e, imageUrl) : undefined}
                onToggleFeatured={onToggleFeaturedImage ? (e) => handleToggleFeatured(e, imageUrl) : undefined}
                isUpdating={isSaving}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
