
import React, { useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableFloorplanItem } from "./SortableFloorplanItem";
import { useSortableFloorplans } from "@/hooks/images/useSortableFloorplans";

interface SortableFloorplanGridProps {
  floorplans: PropertyImage[];
  onRemoveFloorplan: (index: number) => void;
  propertyId: string;
}

export function SortableFloorplanGrid({ 
  floorplans, 
  onRemoveFloorplan,
  propertyId
}: SortableFloorplanGridProps) {
  const { 
    activeId, 
    sortedFloorplans, 
    isSaving, 
    handleDragStart, 
    handleDragEnd,
    setSortedFloorplans
  } = useSortableFloorplans(floorplans, propertyId);
  
  // Update sortedFloorplans when the floorplans prop changes
  useEffect(() => {
    setSortedFloorplans(floorplans);
  }, [floorplans, setSortedFloorplans]);

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
      id="floorplan-grid-dnd-context"
      onDragStart={handleDragStartSafe}
      onDragEnd={handleDragEndSafe}
    >
      <SortableContext 
        items={sortedFloorplans.map(floorplan => floorplan.id)} 
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFloorplans.map((floorplan, index) => (
            <SortableFloorplanItem
              key={floorplan.id}
              id={floorplan.id}
              isActive={activeId === floorplan.id}
              floorplan={floorplan}
              index={index}
              onRemove={() => onRemoveFloorplan(index)}
              isUpdating={isSaving}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
