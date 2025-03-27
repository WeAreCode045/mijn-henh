
import { useState, useMemo } from "react";
import { format, parseISO, addDays, isWithinInterval } from "date-fns";
import { AgendaItem } from "./types";
import { DateRange } from "react-day-picker";

export function useAgendaFiltering(agendaItems: AgendaItem[] = []) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Filter agenda items based on the selected date range
  const filteredAgendaItems = useMemo(() => {
    if (!dateRange || !dateRange.from || !agendaItems.length) {
      return agendaItems; // Return all items if no date range is selected or no items exist
    }

    // If we have a proper DateRange object with from/to dates
    return agendaItems.filter(item => {
      if (!item.event_date) return false;
      
      try {
        const itemDate = parseISO(item.event_date);
        const fromDate = dateRange.from as Date;
        const toDate = dateRange.to as Date || fromDate;
        
        return isWithinInterval(itemDate, { start: fromDate, end: toDate });
      } catch (error) {
        console.error("Error filtering agenda item:", error);
        return false;
      }
    });
  }, [agendaItems, dateRange]);

  return {
    dateRange,
    setDateRange,
    filteredAgendaItems
  };
}
