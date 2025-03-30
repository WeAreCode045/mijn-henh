
import React from "react";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";

interface DayColumnProps {
  day: Date;
  startHour: number;
  endHour: number;
  events: Array<AgendaItem & { start: Date; end: Date }>;
  onEventClick: (item: AgendaItem) => void;
  getEventPosition?: (time: string) => number;
  getEventDuration?: (startTime: string, endTime: string | null) => number;
  getEventColor?: (event: AgendaItem) => string;
  formatEventTime?: (event: AgendaItem) => string;
}

export function DayColumn({
  day,
  startHour,
  endHour,
  events,
  onEventClick,
  getEventPosition = () => 0,
  getEventDuration = () => 30,
  getEventColor = () => '#4338ca',
  formatEventTime = () => ''
}: DayColumnProps) {
  const dayName = format(day, 'EEE');
  const dayNumber = format(day, 'd');
  const isToday = day.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  // Generate time slots
  const timeSlots = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
  
  return (
    <div className="flex-1 min-w-[120px] border-l">
      {/* Day header */}
      <div className={`p-2 text-center border-b ${isToday ? 'bg-primary/10 font-bold' : ''}`}>
        <div className="text-sm font-medium">{dayName}</div>
        <div className={`text-2xl ${isToday ? 'text-primary' : ''}`}>{dayNumber}</div>
      </div>
      
      {/* Day content with time slots */}
      <div className="relative" style={{ height: `${(endHour - startHour + 1) * 60}px` }}>
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
          const position = getEventPosition(event.event_time || '');
          const duration = getEventDuration(event.event_time || '', event.end_time || null);
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
              onClick={() => onEventClick(event)}
            />
          );
        })}
      </div>
    </div>
  );
}
