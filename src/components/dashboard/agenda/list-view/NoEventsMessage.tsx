
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface NoEventsMessageProps {
  isFiltered?: boolean;
  onAddClick?: () => void;
}

export function NoEventsMessage({ isFiltered = false, onAddClick }: NoEventsMessageProps) {
  return (
    <div className="text-center py-10 border rounded-md">
      <div className="flex flex-col items-center justify-center">
        <CalendarPlus className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isFiltered ? "You have no events scheduled" : "No events scheduled"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isFiltered 
            ? "Want to see other dates? Edit your date-range" 
            : "You don't have any events scheduled yet"}
        </p>
        {onAddClick && (
          <Button size="sm" onClick={onAddClick}>
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
}
