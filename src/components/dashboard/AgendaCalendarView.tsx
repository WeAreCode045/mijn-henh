
import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick?: (item: AgendaItem) => void;
  className?: string;
  compactMode?: boolean;
}

export function AgendaCalendarView({ 
  agendaItems, 
  isLoading,
  onItemClick,
  className = "",
  compactMode = false
}: AgendaCalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, boolean>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Extract dates from agenda items
  useEffect(() => {
    const dates: Record<string, boolean> = {};
    
    agendaItems.forEach(item => {
      if (item.event_date) {
        const formattedDate = format(new Date(item.event_date), "yyyy-MM-dd");
        dates[formattedDate] = true;
      }
    });
    
    setMarkedDates(dates);
  }, [agendaItems]);

  // Generate a list of events for the selected day
  const getEventsForDay = useCallback((date: Date) => {
    if (!agendaItems || agendaItems.length === 0) return [];
    
    const selectedDateStr = format(date, "yyyy-MM-dd");
    
    return agendaItems.filter(item => {
      if (!item.event_date) return false;
      return format(new Date(item.event_date), "yyyy-MM-dd") === selectedDateStr;
    });
  }, [agendaItems]);

  // Generate event list for the selected date
  const selectedDayEvents = useMemo(() => 
    selectedDate ? getEventsForDay(selectedDate) : [], 
    [selectedDate, getEventsForDay]
  );

  // Log the events found for the selected day
  useEffect(() => {
    if (selectedDate) {
      console.log("AgendaCalendarView - Selected date:", format(selectedDate, "yyyy-MM-dd"));
      console.log("AgendaCalendarView - Events for selected date:", selectedDayEvents);
    }
  }, [selectedDate, selectedDayEvents]);
  
  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setSelectedDate(date);
      
      // Find items for this date
      const selectedDateStr = format(date, "yyyy-MM-dd");
      const itemsForDate = agendaItems.filter(item => 
        format(new Date(item.event_date), "yyyy-MM-dd") === selectedDateStr
      );
      
      if (itemsForDate.length === 1 && onItemClick) {
        // If only one item on this date, open it directly
        onItemClick(itemsForDate[0]);
      }
      // If multiple items, we could show a popup or list, but that's for a future enhancement
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className={`flex justify-center ${className}`}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        modifiers={{
          hasEvent: (date) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            return formattedDate in markedDates;
          }
        }}
        modifiersClassNames={{
          hasEvent: "bg-primary/20 font-bold text-primary"
        }}
        className={`w-auto ${compactMode ? "p-0" : ""}`}
        styles={{
          cell: compactMode ? { height: '32px' } : undefined,
          day: compactMode ? { height: '28px', width: '28px', fontSize: '0.8rem' } : undefined,
          head_cell: compactMode ? { fontSize: '0.7rem' } : undefined
        }}
      />
    </div>
  );
}
