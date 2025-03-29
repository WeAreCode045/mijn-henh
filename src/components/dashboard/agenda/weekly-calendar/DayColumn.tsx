
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { format } from "date-fns";
import { EventItem } from "./EventItem";

interface DayColumnProps {
  date: Date;
  events: AgendaItem[];
  getEventPosition: (time: string) => number;
  getEventDuration: (startTime: string, endTime: string | null) => number;
  formatEventTime: (event: AgendaItem) => string;
  getEventColor: (event: AgendaItem) => string;
  onItemClick: (item: AgendaItem) => void;
}

export function DayColumn({
  date,
  events,
  getEventPosition,
  getEventDuration,
  formatEventTime,
  getEventColor,
  onItemClick
}: DayColumnProps) {
  const isToday = new Date().toDateString() === date.toDateString();
  
  return (
    <div className="flex-1 min-w-[150px] border-r relative">
      {/* Column header with day */}
      <div className={`h-12 border-b flex flex-col items-center justify-center ${isToday ? 'bg-primary/10' : 'bg-gray-50'}`}>
        <div className="text-sm font-medium">{format(date, "EEE")}</div>
        <div className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
          {format(date, "MMM d")}
        </div>
      </div>
      
      {/* Hour cells */}
      <div className="relative">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-[60px] border-b"></div>
        ))}
        
        {/* Events */}
        {events.map((event) => (
          <EventItem 
            key={event.id}
            event={event}
            position={getEventPosition(event.event_time)}
            duration={getEventDuration(event.event_time, event.end_time)} 
            color={getEventColor(event)}
            timeLabel={formatEventTime(event)}
            onClick={() => onItemClick(event)}
          />
        ))}
      </div>
    </div>
  );
}
