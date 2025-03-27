
import { format, parseISO } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgendaItemDialogProps } from "./types";

export function ViewAgendaItemDialog({ 
  isOpen, 
  onOpenChange, 
  selectedAgendaItem, 
  onDelete, 
  onEdit 
}: AgendaItemDialogProps) {
  if (!selectedAgendaItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedAgendaItem.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(parseISO(selectedAgendaItem.event_date), "PPP")} at {selectedAgendaItem.event_time.substring(0, 5)}
            </span>
          </div>
          {selectedAgendaItem.description && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Details</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedAgendaItem.description}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete} type="button">
                Delete
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} type="button">
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
