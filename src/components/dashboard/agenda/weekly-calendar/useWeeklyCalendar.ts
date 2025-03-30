
import { useState, useEffect } from "react";
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks,
  subWeeks,
  parseISO,
  isSameDay,
  isValid
} from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function useWeeklyCalendar(agendaItems: AgendaItem[]) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<string>("week");
  
  // Calculate the dates for the current week
  useEffect(() => {
    if (!isValid(currentDate)) {
      setCurrentDate(new Date()); // Reset to valid date if current date is invalid
      return;
    }
    
    try {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      
      if (!isValid(start) || !isValid(end)) {
        console.error("Invalid date range:", { start, end, currentDate });
        setCurrentWeek([]); // Empty array to prevent rendering errors
        return;
      }
      
      const days = eachDayOfInterval({ start, end });
      setCurrentWeek(days);
    } catch (error) {
      console.error("Error calculating week dates:", error);
      setCurrentWeek([]); // Empty array to prevent rendering errors
    }
  }, [currentDate]);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };
  
  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Group events by day and time
  const groupedEvents = currentWeek.map(day => {
    return {
      date: day,
      events: agendaItems.filter(item => {
        if (!item.event_date) return false;
        try {
          const eventDate = parseISO(item.event_date);
          return isValid(eventDate) && isSameDay(eventDate, day);
        } catch (error) {
          console.error("Error parsing date:", error, item.event_date);
          return false;
        }
      }).sort((a, b) => {
        // Sort by time
        if (!a.event_time || !b.event_time) return 0;
        return a.event_time.localeCompare(b.event_time);
      })
    };
  });

  return {
    currentDate,
    currentWeek,
    goToPreviousWeek,
    goToToday,
    goToNextWeek,
    groupedEvents,
    activeTab,
    setActiveTab
  };
}
