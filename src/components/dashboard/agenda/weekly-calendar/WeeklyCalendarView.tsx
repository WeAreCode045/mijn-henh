
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { LoadingSpinner } from "./LoadingSpinner";
import { CalendarHeader } from "./CalendarHeader";
import { useWeeklyCalendar } from "./useWeeklyCalendar";
import { useEventFormatting } from "./useEventFormatting";
import { useDndContext } from "./useDndContext";
import { MonthGridView } from "./MonthGridView";
import { TimelineView } from "./TimelineView";
import { format } from "date-fns";

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
        <MonthGridView 
          currentDate={currentDate}
          agendaItems={agendaItems}
          onItemClick={onItemClick}
        />
      ) : (
        /* Day and Week views show the time-based columns */
        <TimelineView 
          groupedEvents={groupedEvents}
          getEventPosition={getEventPosition}
          getEventDuration={getEventDuration}
          formatEventTime={formatEventTime}
          getEventColor={getEventColor}
          onItemClick={onItemClick}
          itemBeingDragged={itemBeingDragged}
          setItemBeingDragged={setItemBeingDragged}
          onDragEnd={onDragEnd}
        />
      )}
    </div>
  );
}
