
import React from 'react';
import { CalendarHeader } from './CalendarHeader';
import { TimeColumn } from './TimeColumn';
import { DayColumn } from './DayColumn';
import { LoadingSpinner } from './LoadingSpinner';
import { format, addDays, startOfWeek } from 'date-fns';
import { useWeeklyCalendar } from './useWeeklyCalendar';
import { AgendaItem } from '@/components/property/dashboard/agenda/types';

interface WeeklyCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  viewMode?: 'day' | 'week';
}

export function WeeklyCalendarView({
  agendaItems,
  isLoading,
  onItemClick,
  viewMode = 'week'
}: WeeklyCalendarViewProps) {
  const {
    currentDate,
    startHour,
    endHour,
    visibleHours,
    goToPrevious,
    goToNext,
    goToToday,
    formattedEvents,
    getEventPosition,
    getEventDuration,
    formatEventTime,
    getEventColor
  } = useWeeklyCalendar(agendaItems);

  // Get visible days based on viewMode
  const getVisibleDays = () => {
    if (viewMode === 'day') {
      // For day view, just show the current date
      return [currentDate];
    } else {
      // For week view, show the whole week
      const weekStart = startOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }
  };

  const visibleDays = getVisibleDays();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        goToToday={goToToday}
        viewMode={viewMode}
      />
      
      <div className="flex overflow-auto flex-1 border rounded-md mt-2">
        <TimeColumn startHour={startHour} endHour={endHour} />
        
        {visibleDays.map((day) => (
          <DayColumn
            key={format(day, 'yyyy-MM-dd')}
            day={day}
            startHour={startHour}
            endHour={endHour}
            events={formattedEvents.filter((event) => 
              format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            )}
            onEventClick={onItemClick}
            getEventPosition={getEventPosition}
            getEventDuration={getEventDuration}
            formatEventTime={formatEventTime}
            getEventColor={getEventColor}
          />
        ))}
      </div>
    </div>
  );
}
