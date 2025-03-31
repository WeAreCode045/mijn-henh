
import { DateRange } from "react-day-picker";
import { useDateNavigation } from "./hooks/useDateNavigation";
import { FilterToggleGroup } from "./components/FilterToggleGroup";
import { PastEventsPresets } from "./components/PastEventsPresets";
import { UpcomingEventsPresets } from "./components/UpcomingEventsPresets";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
  const {
    showPastPresets,
    showUpcomingPresets,
    handleFilterChange,
    handlePresetClick,
    getFilterDisplayText,
    filterPresets,
  } = useDateNavigation(filterValue);
  
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  
  // Handler for custom date range selection
  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setCustomDateRange(range);
      setDateRange(range);
      setFilterValue("customRange");
    }
  };

  // Handler for preset selection
  const handlePresetSelect = (value: string) => {
    if (value === "customRange") {
      if (customDateRange?.from && customDateRange?.to) {
        setDateRange(customDateRange);
      }
    } else {
      handlePresetClick(value);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Display the current filter information */}
      <div className="text-lg font-medium">
        {getFilterDisplayText(filterValue)}
      </div>
      
      {/* Quick filters row */}
      <div className="flex items-center space-x-2">
        <Button 
          variant={filterValue === "past" ? "default" : "outline"} 
          onClick={() => handleFilterChange("past")}
        >
          All Past Events
        </Button>
        <Button 
          variant={filterValue === "thisWeek" ? "default" : "outline"} 
          onClick={() => handleFilterChange("thisWeek")}
        >
          This Week
        </Button>
        <Button 
          variant={filterValue === "upcoming" ? "default" : "outline"} 
          onClick={() => handleFilterChange("upcoming")}
        >
          All Upcoming Events
        </Button>
      </div>
      
      {/* Combined presets dropdown select */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quick filter:</span>
        <Select value={filterValue} onValueChange={handlePresetSelect}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="pastSection" disabled className="font-semibold">Past Events</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="last30Days">Last 30 Days</SelectItem>
            <SelectItem value="pastThisMonth">This Month (Past)</SelectItem>
            <SelectItem value="past">All Past Events</SelectItem>
            <SelectItem value="upcomingSection" disabled className="font-semibold">Upcoming Events</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="nextWeek">Next Week</SelectItem>
            <SelectItem value="upcomingThisMonth">This Month (Upcoming)</SelectItem>
            <SelectItem value="next30Days">Next 30 Days</SelectItem>
            <SelectItem value="upcoming">All Upcoming Events</SelectItem>
            <SelectItem value="customRange">Custom Date Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Custom Date Range Picker */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Custom Range:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDateRange?.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, "PPP")} - {format(customDateRange.to, "PPP")}
                  </>
                ) : (
                  format(customDateRange.from, "PPP")
                )
              ) : (
                <span>Select date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customDateRange?.from}
              selected={customDateRange}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button 
          variant="outline" 
          onClick={() => {
            if (customDateRange?.from && customDateRange?.to) {
              setDateRange(customDateRange);
              setFilterValue("customRange");
            }
          }}
        >
          Apply Range
        </Button>
      </div>
      
      {/* Past event presets - still useful for quick access */}
      <PastEventsPresets 
        visible={showPastPresets}
        onPresetClick={(preset) => {
          // Call the local handler first
          handlePresetClick(preset);
        }}
      />
      
      {/* Upcoming event presets - still useful for quick access */}
      <UpcomingEventsPresets 
        visible={showUpcomingPresets}
        onPresetClick={(preset) => {
          // Call the local handler first
          handlePresetClick(preset);
        }}
      />
    </div>
  );
}
