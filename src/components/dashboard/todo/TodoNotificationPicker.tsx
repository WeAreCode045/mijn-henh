
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TimePicker } from "../TimePicker";

interface TodoNotificationPickerProps {
  notifyAt: Date | undefined;
  notifyTime: string;
  onNotifyAtChange: (date: Date | undefined) => void;
  onNotifyTimeChange: (time: string) => void;
}

export function TodoNotificationPicker({
  notifyAt,
  notifyTime,
  onNotifyAtChange,
  onNotifyTimeChange
}: TodoNotificationPickerProps) {
  return (
    <div className="grid gap-2">
      <Label>Set Notification (optional)</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !notifyAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {notifyAt ? format(notifyAt, "PPP") : "Notification date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={notifyAt}
                onSelect={onNotifyAtChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-24">
          <TimePicker
            value={notifyTime}
            onChange={onNotifyTimeChange}
          />
        </div>
      </div>
      {notifyAt && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-1" 
          onClick={() => onNotifyAtChange(undefined)}
        >
          Clear notification
        </Button>
      )}
    </div>
  );
}
