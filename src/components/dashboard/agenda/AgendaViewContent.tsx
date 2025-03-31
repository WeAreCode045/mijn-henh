
import { Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaItemList } from "@/components/property/dashboard/agenda/AgendaItemList";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { isToday, parseISO, isPast, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";

interface AgendaViewContentProps {
  view: "list";
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function AgendaViewContent({
  view,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick,
}: AgendaViewContentProps) {
  const [timeFilter, setTimeFilter] = useState<string | undefined>(undefined);
  
  // Make sure we always have an array, even if filteredAgendaItems is undefined
  let itemsToDisplay = filteredAgendaItems || [];
  
  // Always check if safeAgendaItems exists before checking its length
  const hasItems = safeAgendaItems && safeAgendaItems.length > 0;
  console.log("AgendaViewContent - hasItems:", hasItems);
  
  // Apply time filter if selected (day, week, month)
  if (timeFilter) {
    itemsToDisplay = filterByTimeRange(itemsToDisplay, timeFilter);
  }
  
  // Group events by day for the list view
  const groupedEvents = groupEventsByDay(itemsToDisplay);
  
  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    if (value === timeFilter) {
      setTimeFilter(undefined); // Toggle off if clicking the same button
    } else {
      setTimeFilter(value);
      setDateRange(undefined); // Clear date range when using time filter
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => {
            setDateRange(undefined);
            setTimeFilter(undefined);
          }}>
            <Filter className="h-4 w-4" />
            {dateRange || timeFilter ? "Clear Filter" : "All Events"}
          </Button>
          
          <ToggleGroup type="single" value={timeFilter} onValueChange={handleTimeFilterChange}>
            <ToggleGroupItem value="day" size="sm">Today</ToggleGroupItem>
            <ToggleGroupItem value="week" size="sm">This Week</ToggleGroupItem>
            <ToggleGroupItem value="month" size="sm">This Month</ToggleGroupItem>
            <ToggleGroupItem value="all" size="sm">All</ToggleGroupItem>
            <ToggleGroupItem value="lastWeek" size="sm">Last Week</ToggleGroupItem>
            <ToggleGroupItem value="lastMonth" size="sm">Last Month</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {isLoading ? (
        // Loading spinner
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !hasItems ? (
        // Empty agenda notification
        <EmptyAgendaNotification onAddClick={onAddClick} />
      ) : (
        // Use the AgendaItemList component to display items
        <AgendaItemList
          filteredAgendaItems={itemsToDisplay}
          isLoading={isLoading}
          onItemClick={onItemClick}
          groupedEvents={groupedEvents}
        />
      )}
    </div>
  );
}

// Helper function to filter events based on time range
function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
  const now = new Date();
  
  // Default case: Return only upcoming events
  if (range === 'all' || !range) {
    return items.filter(item => {
      if (!item.event_date) return false;
      const eventDate = parseISO(item.event_date);
      return !isPast(eventDate) || isToday(eventDate);
    });
  }
  
  return items.filter(item => {
    if (!item.event_date) return false;
    
    const eventDate = parseISO(item.event_date);
    
    switch (range) {
      case 'day':
        return isToday(eventDate);
        
      case 'week': {
        // Get start of week (Monday) and end of week (Sunday)
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        
        return eventDate >= weekStart && eventDate <= weekEnd && (!isPast(eventDate) || isToday(eventDate));
      }
      
      case 'month': {
        // Get start and end of month
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        
        return eventDate >= monthStart && eventDate <= monthEnd && (!isPast(eventDate) || isToday(eventDate));
      }
      
      case 'lastWeek': {
        // Last week
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        
        return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
      }
      
      case 'lastMonth': {
        // Last month
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        
        return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
      }
      
      default:
        return !isPast(eventDate) || isToday(eventDate);
    }
  });
}

// Helper function to group events by day
function groupEventsByDay(events: AgendaItem[]) {
  const groupedEvents: { date: Date; items: AgendaItem[] }[] = [];
  
  // Sort events chronologically first
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.event_date || !b.event_date) return 0;
    const dateA = parseISO(a.event_date);
    const dateB = parseISO(b.event_date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Group by day
  sortedEvents.forEach(event => {
    if (!event.event_date) return;
    
    const eventDate = parseISO(event.event_date);
    const existingGroup = groupedEvents.find(group => 
      isSameDay(group.date, eventDate)
    );
    
    if (existingGroup) {
      existingGroup.items.push(event);
    } else {
      groupedEvents.push({
        date: eventDate,
        items: [event]
      });
    }
  });
  
  return groupedEvents;
}
