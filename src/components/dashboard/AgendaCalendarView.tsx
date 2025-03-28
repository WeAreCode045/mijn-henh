
import { useCallback, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { format } from "date-fns";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaCalendarView({ 
  agendaItems = [], // Provide default empty array
  isLoading,
  onItemClick 
}: AgendaCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Add debugging logs
  useEffect(() => {
    console.log("AgendaCalendarView - agendaItems:", agendaItems);
  }, [agendaItems]);

  // Function to determine if a day has events
  const isDayWithEvents = useCallback((date: Date) => {
    if (!agendaItems || agendaItems.length === 0) return false;
    
    const formattedDateString = format(date, "yyyy-MM-dd");
    return agendaItems.some(item => {
      // Make sure we have a valid event_date
      if (!item.event_date) return false;
      
      try {
        const eventDate = new Date(item.event_date);
        return format(eventDate, "yyyy-MM-dd") === formattedDateString;
      } catch (error) {
        console.error("Error formatting date:", error);
        return false;
      }
    });
  }, [agendaItems]);

  // Generate a list of events for the selected day
  const getEventsForDay = (date: Date) => {
    if (!agendaItems || agendaItems.length === 0) return [];
    
    const formattedDateString = format(date, "yyyy-MM-dd");
    return agendaItems.filter(item => {
      if (!item.event_date) return false;
      
      try {
        const eventDate = new Date(item.event_date);
        return format(eventDate, "yyyy-MM-dd") === formattedDateString;
      } catch (error) {
        console.error("Error filtering events:", error);
        return false;
      }
    });
  };

  // Generate event list for the selected date
  const selectedDayEvents = selectedDate ? 
    getEventsForDay(selectedDate) : 
    [];

  // Log the events found for the selected day
  useEffect(() => {
    if (selectedDate) {
      console.log("AgendaCalendarView - Selected date:", format(selectedDate, "yyyy-MM-dd"));
      console.log("AgendaCalendarView - Events for selected date:", selectedDayEvents);
    }
  }, [selectedDate, selectedDayEvents]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
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
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "All Events"}
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
