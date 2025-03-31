
import React from "react";

// Generate time slots from 0 to 23 (24-hour format)
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

export function TimeColumn() {
  return (
    <div className="w-16 flex-shrink-0 border-r">
      <div className="h-12 border-b flex items-center justify-center bg-gray-50"></div>
      {TIME_SLOTS.map(hour => (
        <div key={hour} className="h-[60px] border-b flex items-start justify-center pt-1 text-xs text-gray-500">
          {hour}:00
        </div>
      ))}
    </div>
  );
}
