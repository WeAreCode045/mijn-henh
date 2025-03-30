
import React from "react";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";

interface DayColumnProps {
  day: Date;
  events: any[]; // Use any type for now to accommodate the formatted events
  startHour?: number;
  endHour?: number;
  onEventClick: (item: AgendaItem) => void;
  getEventPosition: (time: string) => number;
  getEventDuration: (startTime: string, endTime: string | null) => number;
  getEventColor: (event: AgendaItem) => string;
  formatEventTime: (event: AgendaItem) => string;
}

export function DayColumn({
  day,
  events,
  startHour = 8,
  endHour = 19,
  onEventClick,
  getEventPosition,
  getEventDuration,
  getEventColor,
  formatEventTime
}: DayColumnProps) {
  const dayName = format(day, 'EEE');
  const dayNumber = format(day, 'd');
  const isToday = day.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  // Generate time slots from startHour to endHour
  const timeSlots = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  return (
    <div className="flex-1 min-w-[120px] border-l">
      {/* Day header */}
      <div className={`p-2 text-center border-b ${isToday ? 'bg-primary/10 font-bold' : ''}`}>
        <div className="text-sm font-medium">{dayName}</div>
        <div className={`text-2xl ${isToday ? 'text-primary' : ''}`}>{dayNumber}</div>
      </div>
      
      {/* Day content with time slots */}
      <div className="relative" style={{ height: `${timeSlots.length * 60}px` }}>
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
        {events.map(event => (
          <EventItem
            key={event.id}
            event={event}
            position={getEventPosition(event.event_time)}
            duration={getEventDuration(event.event_time, event.end_time)}
            color={event.color || getEventColor(event)}
            timeLabel={event.timeLabel || formatEventTime(event)}
            onClick={() => onEventClick(event)}
          />
        ))}
      </div>
    </div>
  );
}
