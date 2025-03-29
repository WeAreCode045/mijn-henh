
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeSectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  endTime: string | null;
  setEndTime: (time: string) => void;
}

export function DateTimeSection({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime
}: DateTimeSectionProps) {
  // Ensure we never pass null to the inputs
  const safeEndTime = endTime || "";
  
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="startDate" className="text-right col-span-1">
          Start Date
        </label>
        <div className="col-span-3 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="startTime" className="text-right col-span-1">
          Start Time
        </label>
        <Input
          id="startTime"
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="endDate" className="text-right col-span-1">
          End Date
        </label>
        <div className="col-span-3 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Optional</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                defaultMonth={selectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="endTime" className="text-right col-span-1">
          End Time
        </label>
        <Input
          id="endTime"
          type="time"
          value={safeEndTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="col-span-3"
          placeholder="Optional"
        />
      </div>
    </>
  );
}
