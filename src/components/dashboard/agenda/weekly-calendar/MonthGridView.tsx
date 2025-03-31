import React from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { 
  format, 
  parseISO, 
  isSameDay, 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth
} from "date-fns";

interface MonthGridViewProps {
  currentDate: Date;
  agendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
}

export function MonthGridView({ currentDate, agendaItems, onItemClick }: MonthGridViewProps) {
  // Get events for selected day
  const getEventsForDay = (day: Date) => {
    return agendaItems.filter(item => {
      if (!item.event_date) return false;
      try {
        const eventDate = parseISO(item.event_date);
        return isSameDay(eventDate, day);
      } catch (error) {
        return false;
      }
    });
  };

  // Generate month grid display
  const renderMonthGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Calculate days needed before the first day to fill the grid
    const firstDayOfMonth = getDay(monthStart); // 0 for Sunday, 1 for Monday, etc.
    const prependDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for week starting on Monday
    
    // Calculate total cells needed (accounting for days in month plus prepend days)
    const totalCells = daysInMonth.length + prependDays;
    
    // Calculate rows needed (standard 7 columns for days of week)
    const rowsNeeded = Math.ceil(totalCells / 7);
    
    // Get the days to display in the grid
    const gridDays: (Date | null)[] = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < prependDays; i++) {
      gridDays.push(null);
    }
    
    // Add actual days of the month
    gridDays.push(...daysInMonth);
    
    // Add empty cells to fill the last row if needed
    const remainingCells = rowsNeeded * 7 - gridDays.length;
    for (let i = 0; i < remainingCells; i++) {
      gridDays.push(null);
    }
    
    return (
      <div className="border rounded-lg p-4">
        {/* Month header */}
        <div className="text-xl font-semibold mb-4 text-center">
          {format(currentDate, "MMMM yyyy")}
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {gridDays.map((day, index) => {
            if (!day) {
              // Empty cell
              return <div key={`empty-${index}`} className="aspect-square p-1"></div>;
            }
            
            const dayEvents = getEventsForDay(day);
            const eventCount = dayEvents.length;
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={day.toString()} 
                className={`aspect-square border rounded-md p-1 hover:bg-accent/50 cursor-pointer ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'
                }`}
                onClick={() => handleDaySelect(day, dayEvents)}
              >
                <div className="h-full flex flex-col">
                  {/* Day number */}
                  <div className="text-right text-sm font-medium mb-1">
                    {format(day, "d")}
                  </div>
                  
                  {/* Event indicators */}
                  {eventCount > 0 && (
                    <div className="mt-auto flex justify-center gap-1">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      {eventCount > 1 && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                      {eventCount > 2 && (
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      )}
                      {eventCount > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{eventCount - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Handle day selection in month view
  const handleDaySelect = (day: Date, dayEvents: AgendaItem[]) => {
    // If day is undefined, return early
    if (!day) return;
    
    // If there's only one event, open it directly
    if (dayEvents.length === 1) {
      onItemClick(dayEvents[0]);
    } 
    // Otherwise, we could show a list of events for that day or navigate to day view
    else if (dayEvents.length > 1) {
      // For now, just click the first one as a simple implementation
      onItemClick(dayEvents[0]);
    }
  };

  return renderMonthGrid();
}
