
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function useEventFormatting() {
  // Calculate the position of an event in the calendar grid based on its time
  const getEventPosition = (time: string): number => {
    try {
      // Handle different time formats (HH:MM:SS or HH:MM)
      const timeParts = time.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      // Calculate the top position based on hours and minutes
      // Each hour is 60px tall
      return (hours - 8) * 60 + (minutes / 60) * 60;
    } catch (error) {
      console.error("Error calculating position:", error, time);
      return 0;
    }
  };
  
  // Calculate the event duration in pixels based on start and end time
  const getEventDuration = (startTime: string, endTime: string | null): number => {
    // Default 60 minutes if no end time
    if (!endTime) return 60;
    
    try {
      const startTimeParts = startTime.split(":");
      const endTimeParts = endTime.split(":");
      
      const startHours = parseInt(startTimeParts[0], 10);
      const startMinutes = parseInt(startTimeParts[1], 10);
      
      const endHours = parseInt(endTimeParts[0], 10);
      const endMinutes = parseInt(endTimeParts[1], 10);
      
      // Calculate total minutes
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      // Convert minutes to pixels (1 minute = 1px)
      return endTotalMinutes - startTotalMinutes;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60; // Default 60 minutes
    }
  };
  
  // Format event time for display
  const formatEventTime = (event: AgendaItem): string => {
    try {
      // Format the time for display (e.g., "9:00 AM - 10:00 AM")
      const startTime = formatTimeString(event.event_time);
      if (event.end_time) {
        const endTime = formatTimeString(event.end_time);
        return `${startTime} - ${endTime}`;
      }
      return startTime;
    } catch (error) {
      console.error("Error formatting event time:", error);
      return event.event_time || "";
    }
  };
  
  // Helper function to format a time string
  const formatTimeString = (time: string): string => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    } catch (error) {
      return time;
    }
  };
  
  // Calculate colors for events based on property ID or title
  const getEventColor = (event: AgendaItem): string => {
    const colors = [
      "#4F46E5", // indigo
      "#10B981", // emerald
      "#F59E0B", // amber
      "#8B5CF6", // violet
      "#EC4899", // pink
      "#3B82F6", // blue
      "#EF4444", // red
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
