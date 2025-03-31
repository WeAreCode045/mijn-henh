
import { useState, useEffect } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { filterByTimeRange } from "../utils";
import { DateRange } from "react-day-picker";
import { isSameDay, isWithinInterval, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export function useAgendaListView(
  agendaItems: AgendaItem[],
  isLoading: boolean
) {
  const [filterValue, setFilterValue] = useState<string>("thisWeek"); // Default to "thisWeek"
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Initialize with the current week
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: startOfWeek(today, { weekStartsOn: 1 }), 
    to: endOfWeek(today, { weekStartsOn: 1 }) 
  });
  
  const [displayedItems, setDisplayedItems] = useState<AgendaItem[]>([]);
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    if (isLoading || !agendaItems) {
      setDisplayedItems([]);
      return;
    }
    
    console.log(`Filtering ${agendaItems.length} agenda items with filter: ${filterValue} and date range:`, dateRange);
    
    // Apply date range filter if it's set
    let filteredItems = agendaItems;
    
    if (dateRange && dateRange.from) {
      filteredItems = filteredItems.filter(item => {
        if (!item.event_date) return false;
        
        try {
          const eventDate = parseISO(item.event_date);
          
          if (dateRange.to) {
            // If we have a date range, check if the event is within it
            return isWithinInterval(eventDate, {
              start: startOfDay(dateRange.from),
              end: endOfDay(dateRange.to)
            });
          } else {
            // If we only have a from date, check if the event is on that day
            return isSameDay(eventDate, dateRange.from);
          }
        } catch (error) {
          console.error("Error filtering by date range:", error);
          return false;
        }
      });
      
      console.log(`After date range filter: ${filteredItems.length} items with range:`, 
        dateRange?.from ? dateRange.from.toISOString().split('T')[0] : 'none',
        "to",
        dateRange?.to ? dateRange.to.toISOString().split('T')[0] : 'none'
      );
    }
    
    setDisplayedItems(filteredItems);
    
  }, [agendaItems, dateRange, filterValue, isLoading]);

  return {
    filterValue,
    setFilterValue,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    displayedItems
  };
}
