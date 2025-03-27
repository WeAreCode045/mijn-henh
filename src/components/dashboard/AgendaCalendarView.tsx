
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AgendaItem } from "@/hooks/useAgenda";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onDayClick?: (date: Date) => void;
  className?: string;
  compactMode?: boolean;
}

export function AgendaCalendarView({ 
  agendaItems, 
  isLoading,
  onDayClick,
  className = "",
  compactMode = false
}: AgendaCalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, boolean>>({});
  
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
  
  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    if (date && onDayClick) {
      onDayClick(date);
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
    <div className={className}>
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
        className={compactMode ? "p-0" : ""}
        styles={{
          cell: compactMode ? { height: '32px' } : undefined,
          day: compactMode ? { height: '28px', width: '28px', fontSize: '0.8rem' } : undefined,
          head_cell: compactMode ? { fontSize: '0.7rem' } : undefined
        }}
      />
    </div>
  );
}
