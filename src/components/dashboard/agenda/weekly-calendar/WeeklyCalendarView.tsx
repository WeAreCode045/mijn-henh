
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { TimeColumn } from "./TimeColumn";
import { CalendarHeader } from "./CalendarHeader";
import { DayColumn } from "./DayColumn";
import { LoadingSpinner } from "./LoadingSpinner";
import { useWeeklyCalendar } from "./useWeeklyCalendar";
import { useEventFormatting } from "./useEventFormatting";
import { format } from "date-fns";

interface WeeklyCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function WeeklyCalendarView({
  agendaItems,
  isLoading,
  onItemClick
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
          <DayColumn 
            key={date.toISOString()}
            date={date}
            events={events}
            getEventPosition={getEventPosition}
            getEventDuration={getEventDuration}
            getEventColor={getEventColor}
            formatEventTime={formatEventTime}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
