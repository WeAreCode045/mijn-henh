
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

// Generate time slots from 8 AM to 11 PM
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => i + 8);

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
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    
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
          console.error("Error parsing date:", error);
          return false;
        }
      })
    };
  });
  
  // Calculate the position of an event in the calendar grid
  const getEventPosition = (time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      
      // Calculate the top position based on hours and minutes
      // Each hour is 60px tall
      const topPosition = (hours - 8) * 60 + (minutes / 60) * 60;
      
      return {
        top: `${topPosition}px`,
      };
    } catch (error) {
      console.error("Error calculating position:", error);
      return { top: "0px" };
    }
  };
  
  // Calculate random pastel colors for events
  const getEventColor = (title: string) => {
    const colors = [
      "bg-blue-100 border-blue-400 text-blue-700",
      "bg-green-100 border-green-400 text-green-700",
      "bg-yellow-100 border-yellow-400 text-yellow-700",
      "bg-purple-100 border-purple-400 text-purple-700",
      "bg-pink-100 border-pink-400 text-pink-700",
      "bg-indigo-100 border-indigo-400 text-indigo-700",
      "bg-red-100 border-red-400 text-red-700",
    ];
    
    // Use a hash of the title to determine the color
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
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
                const position = getEventPosition(event.event_time || "08:00");
                const colorClass = getEventColor(event.title);
                
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 min-h-[25px] p-1 rounded border text-xs ${colorClass}`}
                    style={{ top: position.top }}
                    onClick={() => onItemClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="truncate">{event.event_time?.substring(0, 5)}</div>
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
