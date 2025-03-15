
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { usePropertyAgenda, AgendaItem } from "@/hooks/usePropertyAgenda";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";

interface AgendaCardProps {
  propertyId: string;
}

export function AgendaCard({ propertyId }: AgendaCardProps) {
  const { agendaItems, isLoading, addAgendaItem, deleteAgendaItem } = usePropertyAgenda(propertyId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter agenda items for the current week
  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());
  
  const thisWeekAgendaItems = agendaItems.filter(item => {
    const itemDate = parseISO(item.event_date);
    return isWithinInterval(itemDate, { start: currentWeekStart, end: currentWeekEnd });
  });

  const handleAddAgendaItem = () => {
    if (selectedDate && title) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      addAgendaItem(title, description, formattedDate, selectedTime);
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setSelectedTime("09:00");
  };

  const handleAgendaItemClick = (item: AgendaItem) => {
    setSelectedAgendaItem(item);
    setIsViewDialogOpen(true);
  };

  const handleDeleteAgendaItem = () => {
    if (selectedAgendaItem) {
      deleteAgendaItem(selectedAgendaItem.id);
      setIsViewDialogOpen(false);
    }
  };
  
  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(true);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Agenda</CardTitle>
        <Button 
          onClick={handleAddButtonClick} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add agenda item</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border mx-auto"
          />
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">This Week's Agenda</h4>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : thisWeekAgendaItems.length === 0 ? (
              <p className="text-center py-2 text-muted-foreground">No items scheduled this week</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {thisWeekAgendaItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-2 border rounded-md hover:bg-accent cursor-pointer flex items-center gap-3 transition-colors"
                    onClick={() => handleAgendaItemClick(item)}
                  >
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-md">
                      <span className="text-sm font-medium">
                        {format(parseISO(item.event_date), "dd")}
                      </span>
                      <span className="text-xs">
                        {format(parseISO(item.event_date), "MMM")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.event_time.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add Agenda Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Agenda Item</DialogTitle>
            <DialogDescription>
              Add a new event to your property agenda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right col-span-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right col-span-1">
                Date
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="date"
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right col-span-1">
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right col-span-1">
                Details
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="button" onClick={handleAddAgendaItem}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Agenda Item Dialog */}
      {selectedAgendaItem && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
              <Button variant="destructive" size="sm" onClick={handleDeleteAgendaItem} type="button">
                Delete
              </Button>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} type="button">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
