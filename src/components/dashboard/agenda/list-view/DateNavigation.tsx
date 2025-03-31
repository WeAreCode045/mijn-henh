
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DateNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function DateNavigation({
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange,
  filterValue,
  setFilterValue
}: DateNavigationProps) {
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
  const [tillCalendarOpen, setTillCalendarOpen] = useState(false);
  const [showPastPresets, setShowPastPresets] = useState(false);
  const [showUpcomingPresets, setShowUpcomingPresets] = useState(false);
  
  // Format a date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select...";
    return format(date, "dd MMM yyyy");
  };

  // Handle from date selection
  const handleFromDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Update the date range - FIX: Use a direct object instead of a function
    const to = dateRange?.to || date;
    
    // If the selected from date is after the to date, set to date to the from date
    if (to && date > to) {
      setDateRange({ from: date, to: date });
    } else {
      setDateRange({ from: date, to: to });
    }
    
    setFromCalendarOpen(false);
  };
  
  // Handle till date selection
  const handleTillDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Update the date range - FIX: Use a direct object instead of a function
    const from = dateRange?.from || new Date();
    
    // If the selected to date is before the from date, set from date to the to date
    if (date < from) {
      setDateRange({ from: date, to: date });
    } else {
      setDateRange({ from: from, to: date });
    }
    
    setTillCalendarOpen(false);
  };
  
  // Toggle preset sections
  const handleFilterChange = (value: string) => {
    // If clicking the current filter, don't change anything
    if (value === filterValue) {
      return;
    }
    
    setFilterValue(value);
    
    // Show appropriate preset options based on filter selection
    if (value === "past") {
      setShowPastPresets(true);
      setShowUpcomingPresets(false);
    } else if (value === "upcoming") {
      setShowPastPresets(false);
      setShowUpcomingPresets(true);
    } else {
      setShowPastPresets(false);
      setShowUpcomingPresets(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Main date range selection */}
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
        </div>
      </div>
      
      {/* Main filter toggle group */}
      <div className="flex items-center justify-between gap-2 border-t border-b py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm font-medium whitespace-nowrap">View:</span>
          <ToggleGroup type="single" value={filterValue} onValueChange={handleFilterChange}>
            <ToggleGroupItem value="past" size="sm">Past</ToggleGroupItem>
            <ToggleGroupItem value="today" size="sm">Today</ToggleGroupItem>
            <ToggleGroupItem value="upcoming" size="sm">Upcoming</ToggleGroupItem>
            <ToggleGroupItem value="thisWeek" size="sm">This Week</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {/* Past event presets */}
      {showPastPresets && (
        <div className="border rounded-lg p-3">
          <h3 className="text-sm font-medium mb-2">Past Events:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("yesterday"); setShowPastPresets(false); }}
            >
              Yesterday
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("lastWeek"); setShowPastPresets(false); }}
            >
              Last Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("lastMonth"); setShowPastPresets(false); }}
            >
              Last Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("last30Days"); setShowPastPresets(false); }}
            >
              Last 30 Days
            </Button>
          </div>
        </div>
      )}
      
      {/* Upcoming event presets */}
      {showUpcomingPresets && (
        <div className="border rounded-lg p-3">
          <h3 className="text-sm font-medium mb-2">Upcoming Events:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("tomorrow"); setShowUpcomingPresets(false); }}
            >
              Tomorrow
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("thisWeek"); setShowUpcomingPresets(false); }}
            >
              This Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("nextWeek"); setShowUpcomingPresets(false); }}
            >
              Next Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("thisMonth"); setShowUpcomingPresets(false); }}
            >
              This Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setFilterValue("next30Days"); setShowUpcomingPresets(false); }}
            >
              Next 30 Days
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
