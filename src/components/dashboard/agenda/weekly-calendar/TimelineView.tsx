
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface TimelineViewProps {
  groupedEvents: {
    date: Date;
    events: AgendaItem[];
  }[];
  getEventPosition: (time: string) => number;
  getEventDuration: (startTime: string, endTime?: string | null) => number;
  formatEventTime: (startTime: string, endTime?: string | null) => string;
  getEventColor: (eventType: string) => string;
  onItemClick: (item: AgendaItem) => void;
  onEventUpdate?: (item: AgendaItem, newDate: string, newTime: string) => void;
  itemBeingDragged: string | null;
  setItemBeingDragged: (id: string | null) => void;
  onDragEnd: (result: any) => void;
}

export function TimelineView({
  groupedEvents,
  getEventPosition,
  getEventDuration,
  formatEventTime,
  getEventColor,
  onItemClick,
  itemBeingDragged,
  setItemBeingDragged,
  onDragEnd
}: TimelineViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex border rounded-lg overflow-auto">
        {/* Time column */}
        <TimeColumn />
        
        {/* Days columns */}
        {groupedEvents.map(({ date, events }) => (
          <Droppable 
            key={date.toISOString()} 
            droppableId={date.toISOString()}
            type="EVENT"
            direction="vertical"
          >
            {(provided) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ flex: 1, minWidth: 120 }}
              >
                <DayColumn 
                  date={date}
                  events={events}
                  getEventPosition={getEventPosition}
                  getEventDuration={getEventDuration}
                  formatEventTime={formatEventTime}
                  getEventColor={getEventColor}
                  onItemClick={onItemClick}
                  itemBeingDragged={itemBeingDragged}
                  setItemBeingDragged={setItemBeingDragged}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
