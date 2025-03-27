
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TimePicker } from "../TimePicker";

interface TodoNotificationPickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function TodoNotificationPicker({
  value,
  onChange
}: TodoNotificationPickerProps) {
  return (
    <div className="grid gap-2">
      <Label>Set Notification (optional)</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Notification date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-1" 
          onClick={() => onChange(undefined)}
        >
          Clear notification
        </Button>
      )}
    </div>
  );
}
