
import { format, parseISO } from "date-fns";
import { CalendarIcon, Pencil, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  // Format date display
  const formatDateRange = () => {
    const startDate = format(parseISO(selectedAgendaItem.event_date), "PPP");
    const startTime = selectedAgendaItem.event_time.substring(0, 5);
    
    if (selectedAgendaItem.end_date) {
      const endDate = format(parseISO(selectedAgendaItem.end_date), "PPP");
      const endTime = selectedAgendaItem.end_time?.substring(0, 5) || "";
      
      if (startDate === endDate) {
        // Same day event
        return `${startDate} from ${startTime} to ${endTime}`;
      } else {
        // Multi-day event
        return `${startDate} at ${startTime} to ${endDate} at ${endTime}`;
      }
    }
    
    // Single date/time event
    return `${startDate} at ${startTime}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedAgendaItem.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{formatDateRange()}</span>
          </div>
          
          {selectedAgendaItem.additional_users && selectedAgendaItem.additional_users.length > 0 && (
            <div className="flex items-start gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm mb-1">Shared with:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedAgendaItem.additional_users.map((userId) => (
                    <Badge key={userId} variant="secondary">
                      {userId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {selectedAgendaItem.description && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Details</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedAgendaItem.description}
              </p>
            </div>
          )}
          
          {selectedAgendaItem.property_id && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                This agenda item is linked to a property
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
