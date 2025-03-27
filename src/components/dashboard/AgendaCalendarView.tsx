
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
  alwaysShow?: boolean;
}

export function AgendaCalendarView({ 
  agendaItems, 
  isLoading,
  onDayClick,
  className = "",
  compactMode = false,
  alwaysShow = false
}: AgendaCalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, boolean>>({});
  
  // Extract dates from agenda items
  useEffect(() => {
    const dates: Record<string, boolean> = {};
    
    agendaItems.forEach(item => {
      const formattedDate = format(new Date(item.event_date), "yyyy-MM-dd");
      dates[formattedDate] = true;
      
      // If till_date exists, mark all dates between event_date and till_date
      if (item.till_date) {
        const startDate = new Date(item.event_date);
        const endDate = new Date(item.till_date);
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const dateString = format(currentDate, "yyyy-MM-dd");
          dates[dateString] = true;
          currentDate.setDate(currentDate.getDate() + 1);
        }
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
  
  if (agendaItems.length === 0 && !alwaysShow) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        No events scheduled
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
          cell: compactMode ? { height: '30px' } : undefined,
          day: compactMode ? { height: '26px', width: '26px', fontSize: '0.75rem' } : undefined,
          head_cell: compactMode ? { fontSize: '0.65rem' } : undefined
        }}
      />
    </div>
  );
}
