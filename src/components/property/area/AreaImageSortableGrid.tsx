
import { PropertyImage } from "@/types/property";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface SortableImageItemProps {
  image: PropertyImage;
  onRemove: () => void;
  isReadOnly?: boolean;
}

function SortableImageItem({ image, onRemove, isReadOnly = false }: SortableImageItemProps) {
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
    cursor: isReadOnly ? 'default' : 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(isReadOnly ? {} : {...attributes, ...listeners})}
      className="relative group"
    >
      <img
        src={image.url}
        alt={`Area image ${image.id}`}
        className="w-full h-32 object-cover rounded-md"
      />
      {!isReadOnly && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 opacity-100 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={isReadOnly}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

interface AreaImageSortableGridProps {
  areaImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesReorder: (areaId: string, reorderedImages: PropertyImage[]) => void;
  isReadOnly?: boolean;
}

export function AreaImageSortableGrid({ 
  areaImages = [], 
  areaId, 
  areaTitle, 
  onImageRemove, 
  onImagesReorder,
  isReadOnly = false
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
    if (isReadOnly) return;
    
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setOrderedImages(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newOrderedImages = arrayMove(items, oldIndex, newIndex);
        
        // Update the parent component with the new order
        onImagesReorder(areaId, newOrderedImages);
        
        return newOrderedImages;
      });
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
          strategy={verticalListSortingStrategy}
        >
          {validAreaImages.map((image) => (
            <SortableImageItem 
              key={image.id}
              image={image}
              onRemove={() => onImageRemove(areaId, image.id)}
              isReadOnly={isReadOnly}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
