
import { useState, useMemo } from "react";
import { format, parseISO, addDays } from "date-fns";
import { AgendaItem, DateRange } from "./types";

export function useAgendaFiltering(agendaItems: AgendaItem[]) {
  const [dateRange, setDateRange] = useState<DateRange>("thisWeek");
  
  // Filter agenda items based on the selected date range
  const filteredAgendaItems = useMemo(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (dateRange) {
      case "today":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return format(itemDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
        });
      case "tomorrow":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return format(itemDate, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd");
        });
      case "thisWeek":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate >= startOfWeek && itemDate <= endOfWeek;
        });
      case "thisMonth":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate >= startOfMonth && itemDate <= endOfMonth;
        });
      default:
        return agendaItems;
    }
  }, [agendaItems, dateRange]);

  return {
    dateRange,
    setDateRange,
    filteredAgendaItems
  };
}
