
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { format } from "date-fns";

export function useEventFormatting() {
  // Convert time string to a position (pixels from top)
  const getEventPosition = (time: string): number => {
    if (!time) return 0;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;
    
    // Start time for the calendar (8:00 AM = 480 minutes)
    const startMinutes = 8 * 60;
    
    // Calculate position (20px per hour = 1/3 px per minute)
    return (totalMinutes - startMinutes) * (1/3);
  };
  
  // Calculate event duration in pixels
  const getEventDuration = (startTime: string, endTime: string | null): number => {
    if (!startTime) return 30; // Default height
    if (!endTime) return 30; // Default height for events without end time
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = (startHours * 60) + startMinutes;
    const endTotalMinutes = (endHours * 60) + endMinutes;
    
    // Calculate duration in minutes, with a minimum of 30 minutes (10px)
    const durationMinutes = Math.max(30, endTotalMinutes - startTotalMinutes);
    
    // Calculate height (20px per hour = 1/3 px per minute)
    return durationMinutes * (1/3);
  };
  
  // Format event time for display
  const formatEventTime = (event: AgendaItem): string => {
    if (!event.event_time) return '';
    
    const timeString = event.event_time.substring(0, 5); // Get HH:MM
    
    if (event.end_time) {
      const endTimeString = event.end_time.substring(0, 5);
      return `${timeString} - ${endTimeString}`;
    }
    
    return timeString;
  };
  
  // Get color for event based on some property
  const getEventColor = (event: AgendaItem): string => {
    // Generate a deterministic color based on the event title or ID
    const hash = event.id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const colors = [
      '#4338ca', // indigo-700
      '#1d4ed8', // blue-700
      '#0369a1', // sky-700
      '#0e7490', // cyan-700
      '#047857', // emerald-700
      '#15803d', // green-700
      '#4d7c0f', // lime-700
      '#b45309', // amber-700
      '#c2410c', // orange-700
      '#b91c1c', // red-700
      '#be185d', // pink-700
      '#a21caf', // fuchsia-700
      '#7e22ce', // purple-700
    ];
    
    return colors[hash % colors.length];
  };
  
  return {
    getEventPosition,
    getEventDuration,
    formatEventTime,
    getEventColor
  };
}
