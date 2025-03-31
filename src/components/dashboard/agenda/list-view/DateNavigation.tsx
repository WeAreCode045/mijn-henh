
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { PredefinedDateRanges } from "./PredefinedDateRanges";

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
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
  const [tillCalendarOpen, setTillCalendarOpen] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  
  // Format a date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select...";
    return format(date, "dd MMM yyyy");
  };

  // Handle from date selection
  const handleFromDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Update the date range
    setDateRange(prev => {
      const to = prev?.to;
      
      // If the selected from date is after the to date, set to date to the from date
      if (to && date > to) {
        return { from: date, to: date };
      }
      
      return { from: date, to: to || date };
    });
    
    setFromCalendarOpen(false);
  };
  
  // Handle till date selection
  const handleTillDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Update the date range
    setDateRange(prev => {
      const from = prev?.from || new Date();
      
      // If the selected to date is before the from date, set from date to the to date
      if (date < from) {
        return { from: date, to: date };
      }
      
      return { from: from, to: date };
    });
    
    setTillCalendarOpen(false);
  };
  
  // Toggle the predefined ranges dropdown
  const togglePredefined = () => {
    setShowPredefined(!showPredefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* From date selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">From:</span>
          <Popover open={fromCalendarOpen} onOpenChange={setFromCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-[140px] justify-start"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(dateRange?.from)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange?.from}
                onSelect={handleFromDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Till date selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">Till:</span>
          <Popover open={tillCalendarOpen} onOpenChange={setTillCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-[140px] justify-start"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(dateRange?.to)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange?.to}
                onSelect={handleTillDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {/* Button to toggle predefined ranges */}
          <Button 
            variant="outline"
            size="sm" 
            onClick={togglePredefined}
          >
            Presets
          </Button>
        </div>
      </div>
      
      {/* Show predefined date range options if toggled */}
      {showPredefined && (
        <div className="p-3 border rounded-lg">
          <PredefinedDateRanges setDateRange={setDateRange} />
        </div>
      )}
    </div>
  );
}
