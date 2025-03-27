
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "../TimePicker";

export interface TodoNotificationPickerProps {
  value: Date;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
  onTimeChange: React.Dispatch<React.SetStateAction<string>>;
  timeValue: string;
}

export function TodoNotificationPicker({ 
  value, 
  onChange,
  timeValue,
  onTimeChange
}: TodoNotificationPickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date, onChange]);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <div className="flex space-x-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !timeValue && "text-muted-foreground"
            )}
          >
            <ClockIcon className="mr-2 h-4 w-4" />
            {timeValue || "Set time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <TimePicker value={timeValue} onChange={onTimeChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
