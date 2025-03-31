import React, { useState } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { TimeColumn } from "./TimeColumn";
import { CalendarHeader } from "./CalendarHeader";
import { DayColumn } from "./DayColumn";
import { LoadingSpinner } from "./LoadingSpinner";
import { useWeeklyCalendar } from "./useWeeklyCalendar";
import { useEventFormatting } from "./useEventFormatting";
import { format, parseISO, addDays, addMinutes, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
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
  const handleDaySelect = (day: Date | undefined) => {
    // If day is undefined, return early
    if (!day) return;
    
    // Find events for the selected day and show a modal or navigate to that day
    const dayEvents = getEventsForDay(day);
    
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
        return isSameDay(eventDate, day);
      } catch (error) {
        return false;
      }
    });
  };

  // Generate month grid display
  const renderMonthGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Calculate days needed before the first day to fill the grid
    const firstDayOfMonth = getDay(monthStart); // 0 for Sunday, 1 for Monday, etc.
    const prependDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for week starting on Monday
    
    // Calculate total cells needed (accounting for days in month plus prepend days)
    const totalCells = daysInMonth.length + prependDays;
    
    // Calculate rows needed (standard 7 columns for days of week)
    const rowsNeeded = Math.ceil(totalCells / 7);
    
    // Get the days to display in the grid
    const gridDays: (Date | null)[] = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < prependDays; i++) {
      gridDays.push(null);
    }
    
    // Add actual days of the month
    gridDays.push(...daysInMonth);
    
    // Add empty cells to fill the last row if needed
    const remainingCells = rowsNeeded * 7 - gridDays.length;
    for (let i = 0; i < remainingCells; i++) {
      gridDays.push(null);
    }
    
    // Split days into weeks (rows)
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < rowsNeeded; i++) {
      weeks.push(gridDays.slice(i * 7, (i + 1) * 7));
    }
    
    return (
      <div className="border rounded-lg p-4">
        {/* Month header */}
        <div className="text-xl font-semibold mb-4 text-center">
          {format(currentDate, "MMMM yyyy")}
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {gridDays.map((day, index) => {
            if (!day) {
              // Empty cell
              return <div key={`empty-${index}`} className="aspect-square p-1"></div>;
            }
            
            const dayEvents = getEventsForDay(day);
            const eventCount = dayEvents.length;
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={day.toString()} 
                className={`aspect-square border rounded-md p-1 hover:bg-accent/50 cursor-pointer ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'
                }`}
                onClick={() => handleDaySelect(day)}
              >
                <div className="h-full flex flex-col">
                  {/* Day number */}
                  <div className="text-right text-sm font-medium mb-1">
                    {format(day, "d")}
                  </div>
                  
                  {/* Event indicators */}
                  {eventCount > 0 && (
                    <div className="mt-auto flex justify-center gap-1">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      {eventCount > 1 && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                      {eventCount > 2 && (
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      )}
                      {eventCount > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{eventCount - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
        renderMonthGrid()
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
