
import { useState, useEffect } from "react";
import { 
  startOfWeek, 
  endOfWeek,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval, 
  addWeeks,
  addDays,
  addMonths,
  subWeeks,
  subDays,
  subMonths,
  parseISO,
  isSameDay,
  isValid
} from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function useWeeklyCalendar(agendaItems: AgendaItem[]) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<string>("week");
  
  // Calculate the dates for the current view (day, week, or month)
  useEffect(() => {
    if (!isValid(currentDate)) {
      setCurrentDate(new Date()); // Reset to valid date if current date is invalid
      return;
    }
    
    try {
      let days: Date[] = [];
      
      if (activeTab === "day") {
        // For day view, just include the current day
        days = [currentDate];
      } else if (activeTab === "week") {
        // For week view, include all days in the week
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        days = eachDayOfInterval({ start, end });
      } else if (activeTab === "month") {
        // For month view, include all days in the month
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        days = eachDayOfInterval({ start, end });
      }
      
      if (days.some(d => !isValid(d))) {
        console.error("Invalid date range:", { currentDate, activeTab });
        setCurrentWeek([]); // Empty array to prevent rendering errors
        return;
      }
      
      setCurrentWeek(days);
    } catch (error) {
      console.error("Error calculating dates:", error);
      setCurrentWeek([]); // Empty array to prevent rendering errors
    }
  }, [currentDate, activeTab]);
  
  // Navigate to previous period
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => {
      if (activeTab === "day") return subDays(prevDate, 1);
      if (activeTab === "month") return subMonths(prevDate, 1);
      return subWeeks(prevDate, 1); // default for week
    });
  };
  
  // Navigate to next period
  const goToNextWeek = () => {
    setCurrentDate(prevDate => {
      if (activeTab === "day") return addDays(prevDate, 1);
      if (activeTab === "month") return addMonths(prevDate, 1);
      return addWeeks(prevDate, 1); // default for week
    });
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
