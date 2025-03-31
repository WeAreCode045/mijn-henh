
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { format, isToday, parseISO, isPast, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";

// Filter events based on time range
export function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
  const now = new Date();
  
  // Special case for "all" - return only upcoming events
  if (range === 'all') {
    return items.filter(item => {
      if (!item.event_date) return false;
      const eventDate = parseISO(item.event_date);
      return !isPast(eventDate) || isToday(eventDate);
    });
  }

  // Special case for "past" - return only past events
  if (range === 'past') {
    return items.filter(item => {
      if (!item.event_date) return false;
      const eventDate = parseISO(item.event_date);
      return isPast(eventDate) && !isToday(eventDate);
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
        
        return eventDate >= weekStart && eventDate <= weekEnd;
      }
      case 'month': {
        // Get start and end of month
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        
        return eventDate >= monthStart && eventDate <= monthEnd;
      }
      default:
        return !isPast(eventDate) || isToday(eventDate);
    }
  });
}

// Group events by day
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

// Get start of current day
export function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
