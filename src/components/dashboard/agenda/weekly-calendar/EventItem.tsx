
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface EventItemProps {
  event: AgendaItem;
  position: number;
  duration: number;
  color: string;
  timeLabel: string;
  onClick: () => void;
}

export function EventItem({
  event,
  position,
  duration,
  color,
  timeLabel,
  onClick
}: EventItemProps) {
  return (
    <div
      className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        top: `${position}px`,
        height: `${Math.max(duration, 25)}px`,
        backgroundColor: color,
        color: '#fff'
      }}
      onClick={onClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-90">{timeLabel}</div>
    </div>
  );
}
