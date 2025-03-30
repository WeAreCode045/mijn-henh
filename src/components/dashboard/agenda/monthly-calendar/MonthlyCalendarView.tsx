
import React, { useState } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay, parseISO, isValid, addMonths, subMonths } from "date-fns";
import { LoadingSpinner } from "../weekly-calendar/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface MonthlyCalendarViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function MonthlyCalendarView({ 
  agendaItems, 
  isLoading, 
  onItemClick 
}: MonthlyCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevDate => subMonths(prevDate, 1));
  };
  
  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevDate => addMonths(prevDate, 1));
  };
  
  // Go to current month
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Get dates that have events
  const getDaysWithEvents = () => {
    return agendaItems
      .filter(item => !!item.event_date)
      .map(item => {
        try {
          const date = parseISO(item.event_date);
          return isValid(date) ? date : null;
        } catch {
          return null;
        }
      })
      .filter((date): date is Date => date !== null);
  };

  const datesWithEvents = getDaysWithEvents();
  
  // Render calendar day with event indicator
  const renderDay = (day: Date) => {
    const hasEvent = datesWithEvents.some(eventDate => isSameDay(day, eventDate));
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        {hasEvent && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
        )}
      </div>
    );
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    // Find events for this day
    const eventsForDay = agendaItems.filter(item => {
      try {
        const eventDate = parseISO(item.event_date);
        return isValid(eventDate) && isSameDay(eventDate, day);
      } catch {
        return false;
      }
    });
    
    // If only one event on the day, click that event
    if (eventsForDay.length === 1) {
      onItemClick(eventsForDay[0]);
    } 
    // Otherwise, we could implement a dialog to show multiple events
    else if (eventsForDay.length > 1) {
      // For now, just click the first event
      onItemClick(eventsForDay[0]);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-4">
      {/* Calendar header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousMonth}
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
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h3 className="text-lg font-medium flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {format(currentMonth, "MMMM yyyy")}
        </h3>
      </div>
      
      {/* Calendar view */}
      <Card>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            classNames={{
              day_today: "bg-muted text-foreground",
              day: "cursor-pointer"
            }}
            components={{
              Day: renderDay
            }}
            onDayClick={handleDayClick}
            showOutsideDays={true}
          />
        </CardContent>
      </Card>

      {/* Events list for selected date */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Today's Events</h4>
        <div className="space-y-2">
          {agendaItems
            .filter(item => {
              try {
                const eventDate = parseISO(item.event_date);
                const today = new Date();
                return isValid(eventDate) && isSameDay(eventDate, today);
              } catch {
                return false;
              }
            })
            .map(item => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:bg-accent/5"
                onClick={() => onItemClick(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-md flex items-center justify-center">
                      <span>{item.event_time?.substring(0, 5) || ''}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {agendaItems.filter(item => {
            try {
              const eventDate = parseISO(item.event_date);
              const today = new Date();
              return isValid(eventDate) && isSameDay(eventDate, today);
            } catch {
              return false;
            }
          }).length === 0 && (
            <p className="text-muted-foreground text-sm">No events scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
}
