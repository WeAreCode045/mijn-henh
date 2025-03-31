
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
  subMonths
} from "date-fns";

// Helper function to filter events based on time range
export function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
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
      case 'today':
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
export function groupEventsByDay(events: AgendaItem[]) {
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
