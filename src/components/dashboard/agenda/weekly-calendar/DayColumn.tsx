
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";
import { format } from "date-fns";

interface DayColumnProps {
  date: Date;
  events: AgendaItem[];
  getEventPosition: (time: string) => number;
  getEventDuration: (startTime: string, endTime?: string | null) => number;
  formatEventTime: (startTime: string, endTime?: string | null) => string;
  getEventColor: (eventType: string) => string;
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
  const dayName = format(date, "EEE");
  const dayNumber = format(date, "d");
  
  return (
    <div className="flex-1 min-w-[120px] relative border-l">
      {/* Day header */}
      <div className={`text-center py-2 border-b ${isToday ? 'bg-primary/10' : ''}`}>
        <div className="font-medium">{dayName}</div>
        <div className={`text-sm ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{dayNumber}</div>
      </div>
      
      {/* Time slots */}
      <div className="relative h-[1440px]"> {/* 24h * 60px = 1440px */}
        {/* Hour markers */}
        {Array.from({ length: 24 }).map((_, hour) => (
          <div 
            key={hour} 
            className="border-b border-gray-100 absolute w-full" 
            style={{ top: `${hour * 60}px` }}
          />
        ))}
        
        {/* Events */}
        {events.map((event) => {
          const position = getEventPosition(event.event_time);
          const duration = getEventDuration(event.event_time, event.end_time);
          const timeLabel = formatEventTime(event.event_time, event.end_time);
          const color = getEventColor(event.title); // Using title as a simple way to get color variation
          
          return (
            <EventItem 
              key={event.id}
              event={event}
              position={position}
              duration={duration}
              color={color}
              timeLabel={timeLabel}
              onClick={() => onItemClick(event)}
            />
          );
        })}
      </div>
    </div>
  );
}
