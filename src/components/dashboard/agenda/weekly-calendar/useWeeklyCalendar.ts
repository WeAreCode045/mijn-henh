
import { useState, useEffect, useMemo } from 'react';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  parseISO,
  isSameDay,
  isWithinInterval,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { AgendaItem } from '@/components/property/dashboard/agenda/types';
import { useEventFormatting } from './useEventFormatting';

export function useWeeklyCalendar(agendaItems: AgendaItem[]) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState<number>(8);
  const [endHour, setEndHour] = useState<number>(18);
  
  const { formatEvents } = useEventFormatting();
  
  // Navigation functions
  const goToPrevious = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };
  
  const goToNext = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate visible hours based on events
  useEffect(() => {
    if (agendaItems.length === 0) return;
    
    let earliestHour = 8;
    let latestHour = 18;
    
    agendaItems.forEach(item => {
      if (item.event_time) {
        const [hours] = item.event_time.split(':').map(Number);
        if (!isNaN(hours)) {
          earliestHour = Math.min(earliestHour, hours);
          latestHour = Math.max(latestHour, hours + 1); // Add 1 hour for event duration
        }
      }
    });
    
    // Adjust boundaries for better visibility
    setStartHour(Math.max(0, earliestHour - 1));
    setEndHour(Math.min(23, latestHour + 1));
  }, [agendaItems]);
  
  // Format events for display in the calendar
  const formattedEvents = useMemo(() => {
    return formatEvents(agendaItems);
  }, [agendaItems, formatEvents]);
  
  // Calculate visible hours for the calendar
  const visibleHours = useMemo(() => {
    return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  }, [startHour, endHour]);
  
  return {
    currentDate,
    setCurrentDate,
    startHour,
    endHour,
    visibleHours,
    goToPrevious,
    goToNext,
    goToToday,
    formattedEvents,
  };
}
