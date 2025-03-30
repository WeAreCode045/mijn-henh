
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { TimeColumn } from "./TimeColumn";
import { CalendarHeader } from "./CalendarHeader";
import { DayColumn } from "./DayColumn";
import { LoadingSpinner } from "./LoadingSpinner";
import { useWeeklyCalendar } from "./useWeeklyCalendar";
import { useEventFormatting } from "./useEventFormatting";

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
      
      {/* Weekly calendar grid */}
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
