
import { format, parseISO, isToday, isSameDay } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

// Filter events based on time range
export function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
  if (range === 'all') {
    return items; // Return all items without filtering when "all" is selected
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return items.filter(item => {
    if (!item.event_date) return false;
    
    const eventDate = parseISO(item.event_date);
    
    switch (range) {
      case 'day':
        return isToday(eventDate);
      case 'week': {
        // Calculate start of week (Sunday) and end of week (Saturday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to Saturday
        
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      case 'month': {
        // Check if in current month
        return eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear();
      }
      default:
        return true;
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
