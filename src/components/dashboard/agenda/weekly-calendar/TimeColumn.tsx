
import React from "react";

interface TimeColumnProps {
  startHour?: number;
  endHour?: number;
}

export function TimeColumn({ startHour = 8, endHour = 19 }: TimeColumnProps) {
  // Generate time slots from startHour to endHour
  const TIME_SLOTS = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <div className="w-16 flex-shrink-0 border-r">
      <div className="h-12 border-b flex items-center justify-center bg-gray-50"></div>
      {TIME_SLOTS.map(hour => (
        <div 
          key={hour} 
          className="h-[60px] border-b flex items-start justify-center pt-1 text-xs text-gray-500"
        >
          {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
        </div>
      ))}
    </div>
  );
}
