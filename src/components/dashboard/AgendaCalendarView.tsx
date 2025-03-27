
import { useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { AgendaItem } from "@/hooks/agenda/types";
import { format } from "date-fns";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaCalendarView({ 
  agendaItems = [], // Provide default empty array
  dateRange,
  setDateRange,
  onItemClick 
}: AgendaCalendarViewProps) {
  // Function to determine if a day has events
  const isDayWithEvents = useCallback((date: Date) => {
    if (!agendaItems || agendaItems.length === 0) return false;
    
    const formattedDateString = format(date, "yyyy-MM-dd");
    return agendaItems.some(item => {
      const eventDate = item.event_date ? new Date(item.event_date) : null;
      return eventDate && format(eventDate, "yyyy-MM-dd") === formattedDateString;
    });
  }, [agendaItems]);

  // Generate a list of events for the selected day or range
  const getEventsForDay = (date: Date) => {
    if (!agendaItems) return [];
    
    const formattedDateString = format(date, "yyyy-MM-dd");
    return agendaItems.filter(item => {
      const eventDate = item.event_date ? new Date(item.event_date) : null;
      return eventDate && format(eventDate, "yyyy-MM-dd") === formattedDateString;
    });
  };

  // Generate event list for the selected date range
  const selectedDayEvents = dateRange?.from ? 
    getEventsForDay(dateRange.from) : 
    [];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={dateRange?.from}
          onSelect={(date) => 
            date && setDateRange({ from: date, to: date })
          }
          modifiers={{
            hasEvents: isDayWithEvents,
          }}
          modifiersStyles={{
            hasEvents: { 
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: 'var(--primary)' 
            }
          }}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">
          {dateRange?.from ? format(dateRange.from, "MMMM d, yyyy") : "All Events"}
        </h3>
        
        {selectedDayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {selectedDayEvents.map((event) => (
              <div 
                key={event.id} 
                className="border rounded-md p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => onItemClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {event.event_time && format(new Date(`2000-01-01T${event.event_time}`), "h:mm a")}
                  {event.end_time && ` - ${format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}`}
                </div>
                {event.description && (
                  <div className="text-sm mt-1 truncate">{event.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
