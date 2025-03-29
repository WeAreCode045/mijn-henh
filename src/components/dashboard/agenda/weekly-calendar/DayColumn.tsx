
import React from "react";
import { format, isToday } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";

// Generate time slots from 8 AM to 7 PM
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8);

interface DayColumnProps {
  date: Date;
  events: AgendaItem[];
  getEventPosition: (time: string) => { top: string };
  getEventDuration: (event: AgendaItem) => number;
  getEventColor: (event: AgendaItem) => string;
  formatEventTime: (time: string) => string;
  onItemClick: (event: AgendaItem) => void;
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
  return (
    <div className="flex-1 min-w-[120px] border-r last:border-r-0">
      {/* Day header */}
      <div 
        className={`h-12 border-b flex flex-col items-center justify-center ${
          isToday(date) ? 'bg-primary/10' : 'bg-gray-50'
        }`}
      >
        <div className="text-xs text-gray-500">{format(date, "EEE")}</div>
        <div className={`text-lg font-semibold ${isToday(date) ? 'text-primary' : ''}`}>
          {format(date, "d")}
        </div>
      </div>
      
      {/* Time slots */}
      <div className="relative">
        {TIME_SLOTS.map(hour => (
          <div key={hour} className="h-[60px] border-b"></div>
        ))}
        
        {/* Events */}
        {events.map(event => {
          const position = getEventPosition(event.event_time);
          const duration = getEventDuration(event);
          const height = Math.max(25, (duration / 60) * 60); // Minimum 25px height
          const colorClass = getEventColor(event);
          
          return (
            <EventItem 
              key={event.id}
              event={event}
              position={position}
              height={height}
              colorClass={colorClass}
              formatEventTime={formatEventTime}
              onClick={() => onItemClick(event)}
            />
          );
        })}
      </div>
    </div>
  );
}
