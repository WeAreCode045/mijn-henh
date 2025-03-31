
import React, { useState } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { TimeColumn } from "./TimeColumn";
import { CalendarHeader } from "./CalendarHeader";
import { DayColumn } from "./DayColumn";
import { LoadingSpinner } from "./LoadingSpinner";
import { useWeeklyCalendar } from "./useWeeklyCalendar";
import { useEventFormatting } from "./useEventFormatting";
import { format, parseISO, addDays, addMinutes } from "date-fns";
import { useDndContext } from "./useDndContext";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface WeeklyCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  onEventUpdate?: (item: AgendaItem, newDate: string, newTime: string) => void;
}

export function WeeklyCalendarView({
  agendaItems,
  isLoading,
  onItemClick,
  onEventUpdate
}: WeeklyCalendarViewProps) {
  const {
    currentDate,
    currentWeek,
    goToPreviousWeek,
    goToToday,
    goToNextWeek,
    groupedEvents,
    activeTab,
    setActiveTab
  } = useWeeklyCalendar(agendaItems);
  
  const {
    getEventPosition,
    getEventDuration,
    formatEventTime,
    getEventColor
  } = useEventFormatting();
  
  const {
    onDragEnd,
    itemBeingDragged,
    setItemBeingDragged
  } = useDndContext(agendaItems, onEventUpdate);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Adjust header title based on active view
  const getHeaderTitle = () => {
    if (activeTab === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (activeTab === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    // Default to week format
    return format(currentWeek[0], "MMMM yyyy") + " (Week " + format(currentWeek[0], "w") + ")";
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full">
        {/* Calendar navigation */}
        <CalendarHeader 
          currentWeek={currentWeek}
          goToPreviousWeek={goToPreviousWeek}
          goToToday={goToToday}
          goToNextWeek={goToNextWeek}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Calendar grid */}
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
      </div>
    </DragDropContext>
  );
}
