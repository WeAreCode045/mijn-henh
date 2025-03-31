
import { useState, useEffect } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { FilterControls } from "./FilterControls";
import { EventGroups } from "./EventGroups";
import { NoEventsMessage } from "./NoEventsMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { filterByTimeRange } from "./utils";
import { DateNavigation } from "./DateNavigation";
import { DateRange } from "react-day-picker";
import { isSameDay, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

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
  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: new Date(), 
    to: new Date() 
  });
  const [displayedItems, setDisplayedItems] = useState<AgendaItem[]>([]);
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    if (isLoading || !agendaItems || agendaItems.length === 0) {
      setDisplayedItems([]);
      return;
    }
    
    // First filter by date range
    let filteredItems = agendaItems;
    
    if (dateRange && dateRange.from) {
      filteredItems = agendaItems.filter(item => {
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
    }
    
    // Then apply time filter if selected
    if (filterValue) {
      filteredItems = filterByTimeRange(filteredItems, filterValue);
    }
    
    console.log(`Displaying ${filteredItems.length} items after filtering with range: ${dateRange?.from} to ${dateRange?.to} and filter: ${filterValue}`);
    
    setDisplayedItems(filteredItems);
    
  }, [agendaItems, dateRange, filterValue, isLoading]);
  
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!agendaItems || agendaItems.length === 0) {
    return (
      <div className="space-y-4">
        <DateNavigation
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <NoEventsMessage onAddClick={onAddClick} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DateNavigation
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <FilterControls 
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      
      {displayedItems.length > 0 ? (
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
