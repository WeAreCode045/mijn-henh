
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function useEventFormatting() {
  // Calculate the position of an event in the calendar grid based on its time
  const getEventPosition = (time: string) => {
    try {
      // Handle different time formats (HH:MM:SS or HH:MM)
      const timeParts = time.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      // Calculate the top position based on hours and minutes
      // Each hour is 60px tall
      const topPosition = (hours - 8) * 60 + (minutes / 60) * 60;
      
      return {
        top: `${topPosition}px`,
      };
    } catch (error) {
      console.error("Error calculating position:", error, time);
      return { top: "0px" };
    }
  };
  
  // Calculate the event duration in minutes 
  const getEventDuration = (event: AgendaItem) => {
    // Default 60 minutes if no end time
    if (!event.end_time) return 60;
    
    try {
      const startTimeParts = event.event_time.split(":");
      const endTimeParts = event.end_time.split(":");
      
      const startHours = parseInt(startTimeParts[0], 10);
      const startMinutes = parseInt(startTimeParts[1], 10);
      
      const endHours = parseInt(endTimeParts[0], 10);
      const endMinutes = parseInt(endTimeParts[1], 10);
      
      // Calculate total minutes
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      return endTotalMinutes - startTotalMinutes;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60; // Default 60 minutes
    }
  };
  
  // Format event time for display
  const formatEventTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    } catch (error) {
      return time;
    }
  };
  
  // Calculate random pastel colors for events based on property ID or title
  const getEventColor = (event: AgendaItem) => {
    const colors = [
      "bg-blue-100 border-blue-400 text-blue-700",
      "bg-green-100 border-green-400 text-green-700",
      "bg-yellow-100 border-yellow-400 text-yellow-700",
      "bg-purple-100 border-purple-400 text-purple-700",
      "bg-pink-100 border-pink-400 text-pink-700",
      "bg-indigo-100 border-indigo-400 text-indigo-700",
      "bg-red-100 border-red-400 text-red-700",
    ];
    
    // Use the property ID or title as the hash source
    const hashSource = event.property_id || event.title;
    
    // Create a hash from the string
    let hash = 0;
    for (let i = 0; i < hashSource.length; i++) {
      hash = hashSource.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return {
    getEventPosition,
    getEventDuration,
    formatEventTime,
    getEventColor
  };
}
