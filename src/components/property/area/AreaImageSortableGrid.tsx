
import { PropertyImage } from "@/types/property";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface SortableImageItemProps {
  image: PropertyImage;
  onRemove: () => void;
}

function SortableImageItem({ image, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="relative group"
    >
      <img
        src={image.url}
        alt={`Area image ${image.id}`}
        className="w-full h-32 object-cover rounded-md"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 opacity-100 shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface AreaImageSortableGridProps {
  areaImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesReorder: (areaId: string, reorderedImageIds: string[]) => void;
}

export function AreaImageSortableGrid({ 
  areaImages = [], 
  areaId, 
  areaTitle, 
  onImageRemove, 
  onImagesReorder 
}: AreaImageSortableGridProps) {
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [orderedImages, setOrderedImages] = useState<PropertyImage[]>([]);
  
  // Reset image load errors when areaImages changes
  useEffect(() => {
    setImageLoadErrors({});
  }, [areaImages]);
  
  // Update orderedImages when areaImages changes
  useEffect(() => {
    setOrderedImages([...areaImages]);
  }, [areaImages]);
  
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // 5px of movement required to start dragging
    },
  }));
  
  const handleImageError = (imageId: string) => {
    console.log(`Image loading error for ${imageId} in area ${areaId}`);
    setImageLoadErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  // Filter out images with load errors
  const validAreaImages = orderedImages.filter(image => !imageLoadErrors[image.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = orderedImages.findIndex(item => item.id === active.id);
      const newIndex = orderedImages.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedImages = arrayMove(orderedImages, oldIndex, newIndex);
        setOrderedImages(newOrderedImages);
        
        // Extract just the IDs for the callback
        const reorderedIds = newOrderedImages.map(img => img.id);
        console.log("Reordered image IDs:", reorderedIds);
        
        // Call the parent component's reorder function
        onImagesReorder(areaId, reorderedIds);
      }
    }
  };

  if (!validAreaImages || validAreaImages.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500 text-sm">
        No images added to this area yet
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <SortableContext 
          items={validAreaImages.map(img => img.id)}
          strategy={rectSortingStrategy}
        >
          {validAreaImages.map((image) => (
            <SortableImageItem 
              key={image.id}
              image={image}
              onRemove={() => onImageRemove(areaId, image.id)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
