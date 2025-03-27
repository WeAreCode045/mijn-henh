
import { Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAgendaNotificationProps {
  onAddClick: () => void;
}

export function EmptyAgendaNotification({ onAddClick }: EmptyAgendaNotificationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-60 border rounded-md border-dashed p-6">
      <Calendar className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No events scheduled</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        You haven't scheduled any events yet. Add your first event to get started.
      </p>
      <Button onClick={onAddClick} className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Event
      </Button>
    </div>
  );
}
