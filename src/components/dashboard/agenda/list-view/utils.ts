
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { 
  isSameDay, 
  parseISO, 
  isPast, 
  isToday, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  subWeeks,
  subMonths,
  isFuture
} from "date-fns";

// Helper function to filter events based on time range
export function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
  if (!items || items.length === 0) return [];
  
  const now = new Date();
  
  // Special case: All events (no filtering)
  if (!range) {
    return items;
  }
  
  console.log(`Filtering ${items.length} items by range: ${range}`);
  
  return items.filter(item => {
    if (!item.event_date) return false;
    
    try {
      const eventDate = parseISO(item.event_date);
      
      switch (range) {
        case 'today':
          return isToday(eventDate);
          
        case 'week': {
          // Get start of week (Monday) and end of week (Sunday)
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
          
          return eventDate >= weekStart && eventDate <= weekEnd;
        }
        
        case 'month': {
          // Get start and end of month
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          
          return eventDate >= monthStart && eventDate <= monthEnd;
        }
        
        case 'upcoming':
          // Future events
          return isFuture(eventDate);
          
        case 'past':
          // Past events
          return isPast(eventDate) && !isToday(eventDate);
          
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
          return true; // No filter applied (show all)
      }
    } catch (error) {
      console.error(`Error filtering event with date ${item.event_date}:`, error);
      return false;
    }
  });
}

// Helper function to group events by day
export function groupEventsByDay(events: AgendaItem[]) {
  if (!events || events.length === 0) return [];
  
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
    
    try {
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
    } catch (error) {
      console.error(`Error grouping event with date ${event.event_date}:`, error);
    }
  });
  
  return groupedEvents;
}
