
import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { GripVertical } from "lucide-react";

interface EventItemProps {
  event: AgendaItem;
  position: number;
  duration: number;
  color: string;
  timeLabel: string;
  onClick: () => void;
  isDragging?: boolean;
}

export function EventItem({
  event,
  position,
  duration,
  color,
  timeLabel,
  onClick,
  isDragging = false
}: EventItemProps) {
  return (
    <div
      className={`rounded-md px-2 py-1 text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}
      style={{
        height: `${Math.max(duration, 25)}px`,
        backgroundColor: color,
        color: '#fff'
      }}
      onClick={onClick}
    >
      <div className="flex items-start space-between">
        <div className="flex-grow">
          <div className="font-medium truncate">{event.title}</div>
          <div className="text-xs opacity-90">{timeLabel}</div>
        </div>
        <GripVertical className="h-4 w-4 opacity-60 hover:opacity-100" />
      </div>
    </div>
  );
}
