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
import { Calendar } from "@/components/ui/calendar";

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
  
  // Handle day selection in month view
  const handleDaySelect = (day: Date) => {
    // Find events for the selected day and show a modal or navigate to that day
    const dayEvents = agendaItems.filter(item => {
      if (!item.event_date) return false;
      try {
        const eventDate = parseISO(item.event_date);
        return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      } catch (error) {
        return false;
      }
    });
    
    // If there's only one event, open it directly
    if (dayEvents.length === 1) {
      onItemClick(dayEvents[0]);
    } 
    // Otherwise, we could show a list of events for that day or navigate to day view
    else if (dayEvents.length > 1) {
      // For now, just click the first one as a simple implementation
      onItemClick(dayEvents[0]);
    }
  };
  
  // Get events for selected day
  const getEventsForDay = (day: Date) => {
    return agendaItems.filter(item => {
      if (!item.event_date) return false;
      try {
        const eventDate = parseISO(item.event_date);
        return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      } catch (error) {
        return false;
      }
    });
  };
  
  return (
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
      
      {/* Month view (calendar grid) */}
      {activeTab === "month" ? (
        <div className="border rounded-lg p-2">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => date && handleDaySelect(date)}
            className="w-full"
            components={{
              Day: ({ day, ...props }) => {
                // Get events for this day
                const dayStr = format(day, 'yyyy-MM-dd');
                const events = agendaItems.filter(item => {
                  if (!item.event_date) return false;
                  return format(parseISO(item.event_date), 'yyyy-MM-dd') === dayStr;
                });
                
                return (
                  <div className="relative" {...props}>
                    <div>{format(day, "d")}</div>
                    {events.length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        <div className="h-1 w-1 bg-primary rounded-full"></div>
                        {events.length > 1 && (
                          <>
                            <div className="h-1 w-1 bg-primary rounded-full mx-0.5"></div>
                            {events.length > 2 && (
                              <div className="h-1 w-1 bg-primary rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      ) : (
        /* Day and Week views show the time-based columns */
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
      )}
    </div>
  );
}
