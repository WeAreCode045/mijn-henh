
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TodoDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
}

export function TodoDatePicker({ value, onChange, label = "Due Date" }: TodoDatePickerProps) {
  return (
    <div className="grid gap-2">
      <Label>{label} (optional)</Label>
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
            {value ? format(value, "PPP") : `Pick a ${label.toLowerCase()}`}
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
          Clear {label.toLowerCase()}
        </Button>
      )}
    </div>
  );
}
