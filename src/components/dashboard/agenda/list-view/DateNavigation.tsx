
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
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
      
      // For "today", automatically update date range
      if (value === "today") {
        const today = new Date();
        setDateRange({ from: today, to: today });
      } else if (value === "thisWeek") {
        // For thisWeek, set date range to current week
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Get Monday
        const sunday = new Date(today);
        sunday.setDate(monday.getDate() + 6); // Get Sunday
        setDateRange({ from: monday, to: sunday });
      }
    }
  };
  
  // Update date range when preset is clicked
  const handlePresetClick = (presetValue: string) => {
    const today = new Date();
    
    switch (presetValue) {
      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      }
      case "lastWeek": {
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - today.getDay() - 6);
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - today.getDay());
        setDateRange({ from: lastMonday, to: lastSunday });
        break;
      }
      case "thisMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRange({ from: firstDay, to: lastDay });
        break;
      }
      case "lastMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateRange({ from: firstDay, to: lastDay });
        break;
      }
      case "last30Days": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateRange({ from: thirtyDaysAgo, to: today });
        break;
      }
      case "tomorrow": {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDateRange({ from: tomorrow, to: tomorrow });
        break;
      }
      case "thisWeek": {
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        const sunday = new Date(today);
        sunday.setDate(monday.getDate() + 6);
        setDateRange({ from: monday, to: sunday });
        break;
      }
      case "nextWeek": {
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() - today.getDay() + 8);
        const nextSunday = new Date(today);
        nextSunday.setDate(nextMonday.getDate() + 6);
        setDateRange({ from: nextMonday, to: nextSunday });
        break;
      }
      case "next30Days": {
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);
        setDateRange({ from: today, to: thirtyDaysLater });
        break;
      }
    }
    
    // Close the preset menus
    setShowPastPresets(false);
    setShowUpcomingPresets(false);
    
    // Update the filter value
    setFilterValue(presetValue);
  };
  
  // Initialize with thisWeek preset
  useEffect(() => {
    if (!dateRange?.from && !dateRange?.to) {
      handlePresetClick("thisWeek");
    }
  }, []);
  
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
              onClick={() => handlePresetClick("yesterday")}
            >
              Yesterday
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("lastWeek")}
            >
              Last Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("lastMonth")}
            >
              Last Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("last30Days")}
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
              onClick={() => handlePresetClick("tomorrow")}
            >
              Tomorrow
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("thisWeek")}
            >
              This Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("nextWeek")}
            >
              Next Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("thisMonth")}
            >
              This Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetClick("next30Days")}
            >
              Next 30 Days
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
