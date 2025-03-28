
import { useState, useEffect } from "react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  isSameDay, 
  addWeeks, 
  subWeeks, 
  parseISO,
  getHours,
  getMinutes,
  set
} from "date-fns";
import { Button } from "@/components/ui/button";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Generate time slots from 8 AM to 7 PM
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8);

interface WeeklyCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function WeeklyCalendarView({
  agendaItems,
  isLoading,
  onItemClick
}: WeeklyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  
  // Calculate the dates for the current week
  useEffect(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    
    const days = eachDayOfInterval({ start, end });
    setCurrentWeek(days);
  }, [currentDate]);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };
  
  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Group events by day and time
  const groupedEvents = currentWeek.map(day => {
    return {
      date: day,
      events: agendaItems.filter(item => {
        if (!item.event_date) return false;
        try {
          const eventDate = parseISO(item.event_date);
          return isSameDay(eventDate, day);
        } catch (error) {
          console.error("Error parsing date:", error, item.event_date);
          return false;
        }
      }).sort((a, b) => {
        // Sort by time
        if (!a.event_time || !b.event_time) return 0;
        return a.event_time.localeCompare(b.event_time);
      })
    };
  });
  
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Calendar navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousWeek}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="h-8"
          >
            Today
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextWeek}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h3 className="text-lg font-medium">
          {format(currentWeek[0], "MMMM yyyy")} (Week {format(currentWeek[0], "w")})
        </h3>
        
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" className="h-8">Day</Button>
          <Button variant="secondary" size="sm" className="h-8">Week</Button>
          <Button variant="outline" size="sm" className="h-8">Month</Button>
        </div>
      </div>
      
      {/* Weekly calendar grid */}
      <div className="flex border rounded-lg overflow-auto">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r">
          <div className="h-12 border-b flex items-center justify-center bg-gray-50"></div>
          {TIME_SLOTS.map(hour => (
            <div key={hour} className="h-[60px] border-b flex items-start justify-center pt-1 text-xs text-gray-500">
              {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
            </div>
          ))}
        </div>
        
        {/* Days columns */}
        {groupedEvents.map(({ date, events }) => (
          <div key={date.toISOString()} className="flex-1 min-w-[120px] border-r last:border-r-0">
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
                const location = event.property?.title ? `@ ${event.property.title}` : '';
                
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 p-1 rounded border text-xs cursor-pointer hover:opacity-90 ${colorClass}`}
                    style={{ 
                      top: position.top,
                      height: `${height}px`,
                      overflow: "hidden"
                    }}
                    onClick={() => onItemClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="truncate text-[10px]">{formatEventTime(event.event_time)}</div>
                    {location && (
                      <div className="truncate text-[10px] italic">{location}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
