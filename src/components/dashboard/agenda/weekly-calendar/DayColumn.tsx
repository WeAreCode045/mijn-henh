
import React from "react";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";

interface DayColumnProps {
  date: Date;
  events: AgendaItem[];
  getEventPosition: (time: string) => number;
  getEventDuration: (startTime: string, endTime: string | null) => number;
  getEventColor: (event: AgendaItem) => string;
  formatEventTime: (event: AgendaItem) => string;
  onItemClick: (item: AgendaItem) => void;
}

export function DayColumn({
  date,
  events,
  getEventPosition,
  getEventDuration,
  getEventColor,
  formatEventTime,
  onItemClick
}: DayColumnProps) {
  const dayName = format(date, 'EEE');
  const dayNumber = format(date, 'd');
  const isToday = date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  // Generate time slots (1 hour intervals)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
  
  return (
    <div className="flex-1 min-w-[120px] border-l">
      {/* Day header */}
      <div className={`p-2 text-center border-b ${isToday ? 'bg-primary/10 font-bold' : ''}`}>
        <div className="text-sm font-medium">{dayName}</div>
        <div className={`text-2xl ${isToday ? 'text-primary' : ''}`}>{dayNumber}</div>
      </div>
      
      {/* Day content with time slots */}
      <div className="relative" style={{ height: '780px' }}> {/* 13 hours * 60px */}
        {/* Time slot guidelines */}
        {timeSlots.map(hour => (
          <div 
            key={hour} 
            className="border-b h-[60px] flex items-end justify-end pr-1 text-[10px] text-muted-foreground"
          >
            {/* Empty slot */}
          </div>
        ))}
        
        {/* Event items */}
        {events.map(event => {
          const position = getEventPosition(event.event_time);
          const duration = getEventDuration(event.event_time, event.end_time);
          const color = getEventColor(event);
          const timeLabel = formatEventTime(event);
          
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
