
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

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
  const [navigationMode, setNavigationMode] = useState<"day" | "month">("day");
  
  // Day navigation
  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
    // Also update the date range to focus on this day
    setDateRange({ from: subDays(selectedDate, 1), to: subDays(selectedDate, 1) });
  };
  
  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
    // Also update the date range to focus on this day
    setDateRange({ from: addDays(selectedDate, 1), to: addDays(selectedDate, 1) });
  };
  
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    // Also update the date range to focus on today
    setDateRange({ from: today, to: today });
  };
  
  // Month navigation
  const goToPreviousMonth = () => {
    const prevMonth = subMonths(selectedDate, 1);
    const firstDayOfMonth = startOfMonth(prevMonth);
    
    setSelectedDate(firstDayOfMonth);
    setDateRange({ from: firstDayOfMonth, to: endOfMonth(prevMonth) });
    
    // Switch navigation mode to month
    setNavigationMode("month");
  };
  
  const goToNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    const firstDayOfMonth = startOfMonth(nextMonth);
    
    setSelectedDate(firstDayOfMonth);
    setDateRange({ from: firstDayOfMonth, to: endOfMonth(nextMonth) });
    
    // Switch navigation mode to month
    setNavigationMode("month");
  };
  
  // Date picker change handler
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDateRange({ from: date, to: date });
      
      // Switch navigation mode to day when selecting a specific date
      setNavigationMode("day");
    }
  };
  
  // Date range picker change handler
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range && range.from) {
      setDateRange(range);
      setSelectedDate(range.from);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {navigationMode === "day" 
            ? format(selectedDate, "EEEE, MMMM d, yyyy") 
            : format(selectedDate, "MMMM yyyy")}
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Day navigation */}
          <div className="border rounded-md flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-l-md"
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 font-normal hover:bg-transparent"
              onClick={goToToday}
            >
              Today
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-r-md"
              onClick={goToNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Month navigation */}
          <div className="border rounded-md flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-l-md"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 font-normal hover:bg-transparent"
              onClick={() => {
                const firstDayOfMonth = startOfMonth(new Date());
                setSelectedDate(firstDayOfMonth);
                setDateRange({ from: firstDayOfMonth, to: endOfMonth(firstDayOfMonth) });
                setNavigationMode("month");
              }}
            >
              This Month
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-r-md"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Date picker for manual selection */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to && dateRange.from !== dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDate}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
