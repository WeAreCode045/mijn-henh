
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableImageItem } from './SortableImageItem';
import { PropertyImage } from '@/types/property';
import { Loader2 } from 'lucide-react';

interface SortableImageGridProps {
  items: PropertyImage[];
  onDragEnd: (event: DragEndEvent) => void;
  onDelete: (id: string) => void;
  isSaving?: boolean;
}

export function SortableImageGrid({ 
  items, 
  onDragEnd, 
  onDelete,
  isSaving = false
}: SortableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="relative mt-4">
      {isSaving && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Saving order...</span>
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <SortableImageItem 
                key={item.id} 
                id={item.id} 
                image={item}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
