
import { useState } from 'react';
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DropResult } from '@hello-pangea/dnd';
import { parseISO, format, addHours, addMinutes } from 'date-fns';

export function useDndContext(
  agendaItems: AgendaItem[],
  onEventUpdate?: (item: AgendaItem, newDate: string, newTime: string) => void
) {
  const [itemBeingDragged, setItemBeingDragged] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Reset the dragging state
    setItemBeingDragged(null);
    
    // If there's no destination or it's the same as source, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Find the dragged item
    const draggedItem = agendaItems.find(item => item.id === draggableId);
    if (!draggedItem || !onEventUpdate) return;
    
    try {
      // Calculate new date based on the destination column (droppableId is the date string)
      const newDate = destination.droppableId.split('T')[0]; // Extract date part
      
      // Calculate new time based on the drop position
      // Each unit in destination.index represents 15 minutes
      // Start time is at 00:00 (midnight)
      const baseHour = Math.floor(destination.index / 4); // Each hour has 4 quarter-hours
      const baseMinutes = (destination.index % 4) * 15; // Remainder gives us the minutes (in 15-min intervals)
      
      // Format as HH:MM:SS
      const newTime = `${String(baseHour).padStart(2, '0')}:${String(baseMinutes).padStart(2, '0')}:00`;
      
      console.log(`Moving event to: ${newDate} ${newTime}`);
      
      // Call the update handler
      onEventUpdate(draggedItem, newDate, newTime);
    } catch (error) {
      console.error("Error updating event time via drag and drop:", error);
    }
  };

  return {
    onDragEnd,
    itemBeingDragged,
    setItemBeingDragged
  };
}
