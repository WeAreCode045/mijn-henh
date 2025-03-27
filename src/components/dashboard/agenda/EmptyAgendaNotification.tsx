
import { CalendarX, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAgendaNotificationProps {
  onAddClick: (e: React.MouseEvent) => void;
}

export function EmptyAgendaNotification({ onAddClick }: EmptyAgendaNotificationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/20 rounded-lg border border-muted mt-4">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No Events Scheduled</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
        Your agenda is currently empty. Click the "Add Event" button above to schedule your first event.
      </p>
      <Button onClick={onAddClick} variant="outline" className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Your First Event
      </Button>
    </div>
  );
}
