
import { PropertyFloorplan } from "@/types/property";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableFloorplanItem } from "./SortableFloorplanItem";

interface SortableFloorplanGridProps {
  floorplans: PropertyFloorplan[];
  onRemoveFloorplan: (index: number) => void;
  onDragEnd: any; // Use the DragEndEvent type here
}

export function SortableFloorplanGrid({
  floorplans,
  onRemoveFloorplan,
  onDragEnd
}: SortableFloorplanGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!floorplans || floorplans.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-gray-500">
        No floorplans uploaded yet. Click "Upload Floorplans" to add floorplans.
      </div>
    );
  }
  
  // Helper function to get the URL from a floorplan object
  const getFloorplanUrl = (floorplan: any): string => {
    if (typeof floorplan === 'string') return floorplan;
    if (floorplan && typeof floorplan === 'object' && 'url' in floorplan) return floorplan.url;
    return '';
  };
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={floorplans.map(floorplan => floorplan.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {floorplans.map((floorplan, index) => {
            const url = getFloorplanUrl(floorplan);
            const label = floorplan.title || `Floorplan ${index + 1}`;
            
            return (
              <SortableFloorplanItem
                key={floorplan.id}
                id={floorplan.id}
                url={url}
                label={label}
                onRemove={() => onRemoveFloorplan(index)}
                sort_order={floorplan.sort_order}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
