import { useState, useEffect } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventGroups } from "./EventGroups";
import { NoEventsMessage } from "./NoEventsMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { filterByTimeRange } from "./utils";
import { DateNavigation } from "./DateNavigation";
import { DateRange } from "react-day-picker";
import { isSameDay, isWithinInterval, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

interface AgendaListViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  onAddClick?: () => void;
}

export function AgendaListView({ 
  agendaItems, 
  isLoading,
  onItemClick,
  onAddClick
}: AgendaListViewProps) {
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
    
    // Apply time filter if selected
    let filteredItems = agendaItems;
    
    // For specific presets like upcoming, past, today, etc., use the time-based filter
    if (["upcoming", "past", "today", "yesterday", "tomorrow"].includes(filterValue)) {
      filteredItems = filterByTimeRange(filteredItems, filterValue);
      console.log(`After time filter (${filterValue}): ${filteredItems.length} items`);
    } 
    // Otherwise, filter by the date range if it's set
    else if (dateRange && dateRange.from) {
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
  
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4">
      <DateNavigation
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      
      {!agendaItems || agendaItems.length === 0 ? (
        <NoEventsMessage onAddClick={onAddClick} />
      ) : displayedItems.length > 0 ? (
        <EventGroups 
          filteredItems={displayedItems} 
          onItemClick={onItemClick}
          showPastEvents={true}
        />
      ) : (
        <NoEventsMessage isFiltered onAddClick={onAddClick} />
      )}
    </div>
  );
}
