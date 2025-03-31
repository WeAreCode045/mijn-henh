
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DateRangePickersProps {
  dateRange: DateRange | undefined;
  onFromDateSelect: (date: Date | undefined) => void;
  onTillDateSelect: (date: Date | undefined) => void;
}

export function DateRangePickers({
  dateRange,
  onFromDateSelect,
  onTillDateSelect
}: DateRangePickersProps) {
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
  const [tillCalendarOpen, setTillCalendarOpen] = useState(false);
  
  // Format a date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select...";
    return format(date, "dd MMM yyyy");
  };

  return (
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
              onSelect={(date) => {
                onFromDateSelect(date);
                setFromCalendarOpen(false);
              }}
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
              onSelect={(date) => {
                onTillDateSelect(date);
                setTillCalendarOpen(false);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
