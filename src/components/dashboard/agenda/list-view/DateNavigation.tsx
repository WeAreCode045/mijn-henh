
import { Button } from "@/components/ui/button";
import { DateRange, DayPicker } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from "lucide-react";
import { addDays, addMonths, format, isToday, subDays, subMonths } from "date-fns";
import { useState } from "react";

interface DateNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

export function DateNavigation({
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange
}: DateNavigationProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const goToPreviousDay = () => {
    const prevDay = subDays(selectedDate, 1);
    setSelectedDate(prevDay);
    setDateRange({ from: prevDay, to: prevDay });
  };
  
  const goToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    setDateRange({ from: nextDay, to: nextDay });
  };
  
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setDateRange({ from: today, to: today });
  };
  
  const goToPreviousMonth = () => {
    const prevMonth = subMonths(selectedDate, 1);
    setSelectedDate(prevMonth);
    setDateRange({ from: prevMonth, to: prevMonth });
  };
  
  const goToNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(nextMonth);
    setDateRange({ from: nextMonth, to: nextMonth });
  };
  
  const handleSelectRange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      if (range.from) {
        setSelectedDate(range.from);
      }
      setIsCalendarOpen(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
      {/* Day navigation */}
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className={isToday(selectedDate) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
          onClick={goToToday}
        >
          {format(selectedDate, "EEEE, d MMM")}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Month navigation and calendar picker */}
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>{format(selectedDate, "MMMM yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleSelectRange}
              initialFocus
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
