
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface EventItemProps {
  event: AgendaItem;
  position: { top: string };
  height: number;
  colorClass: string;
  formatEventTime: (time: string) => string;
  onClick: () => void;
}

export function EventItem({
  event,
  position,
  height,
  colorClass,
  formatEventTime,
  onClick
}: EventItemProps) {
  const location = event.property?.title ? `@ ${event.property.title}` : '';
  
  return (
    <div
      className={`absolute left-1 right-1 p-1 rounded border text-xs cursor-pointer hover:opacity-90 ${colorClass}`}
      style={{ 
        top: position.top,
        height: `${height}px`,
        overflow: "hidden"
      }}
      onClick={onClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="truncate text-[10px]">{formatEventTime(event.event_time)}</div>
      {location && (
        <div className="truncate text-[10px] italic">{location}</div>
      )}
    </div>
  );
}
