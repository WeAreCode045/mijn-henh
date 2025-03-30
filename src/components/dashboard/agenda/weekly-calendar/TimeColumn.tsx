
import React from "react";

// Generate time slots from 8 AM to 7 PM
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8);

export function TimeColumn() {
  return (
    <div className="w-16 flex-shrink-0 border-r">
      <div className="h-12 border-b flex items-center justify-center bg-gray-50"></div>
      {TIME_SLOTS.map(hour => (
        <div key={hour} className="h-[60px] border-b flex items-start justify-center pt-1 text-xs text-gray-500">
          {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
        </div>
      ))}
    </div>
  );
}
