
import { useState, useMemo } from "react";
import { format, parseISO, addDays } from "date-fns";
import { AgendaItem } from "./types";
import { DateRange } from "react-day-picker";

export function useAgendaFiltering(agendaItems: AgendaItem[]) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Filter agenda items based on the selected date range
  const filteredAgendaItems = useMemo(() => {
    if (!dateRange) {
      return agendaItems; // Return all items if no date range is selected
    }

    // If we have a proper DateRange object with from/to dates
    if (dateRange.from) {
      return agendaItems.filter(item => {
        const itemDate = parseISO(item.event_date);
        const fromDate = dateRange.from as Date;
        const toDate = dateRange.to as Date || fromDate;
        
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    return agendaItems;
  }, [agendaItems, dateRange]);

  return {
    dateRange,
    setDateRange,
    filteredAgendaItems
  };
}
