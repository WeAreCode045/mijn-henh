
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Pencil } from "lucide-react";
import { usePropertyAgenda, AgendaItem } from "@/hooks/usePropertyAgenda";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO, addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgendaCardProps {
  propertyId: string;
}

type DateRange = "today" | "tomorrow" | "thisWeek" | "thisMonth" | "all";

export function AgendaCard({ propertyId }: AgendaCardProps) {
  const { agendaItems, isLoading, addAgendaItem, deleteAgendaItem, updateAgendaItem } = usePropertyAgenda(propertyId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("thisWeek");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());
  const [editTime, setEditTime] = useState("");

  // Filter agenda items based on the selected date range
  const getFilteredAgendaItems = () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (dateRange) {
      case "today":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate.toDateString() === today.toDateString();
        });
      case "tomorrow":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate.toDateString() === tomorrow.toDateString();
        });
      case "thisWeek":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate >= startOfWeek && itemDate <= endOfWeek;
        });
      case "thisMonth":
        return agendaItems.filter(item => {
          const itemDate = parseISO(item.event_date);
          return itemDate >= startOfMonth && itemDate <= endOfMonth;
        });
      default:
        return agendaItems;
    }
  };

  const filteredAgendaItems = getFilteredAgendaItems();

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

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedAgendaItem) {
      setEditTitle(selectedAgendaItem.title);
      setEditDescription(selectedAgendaItem.description || "");
      setEditDate(parseISO(selectedAgendaItem.event_date));
      setEditTime(selectedAgendaItem.event_time.substring(0, 5));
      setIsViewDialogOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateAgendaItem = () => {
    if (selectedAgendaItem && editDate) {
      const formattedDate = format(editDate, "yyyy-MM-dd");
      updateAgendaItem(
        selectedAgendaItem.id, 
        editTitle, 
        editDescription, 
        formattedDate, 
        editTime
      );
      setIsEditDialogOpen(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
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
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">Agenda Items</h4>
            <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="all">All Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAgendaItems.length === 0 ? (
              <p className="text-center py-2 text-muted-foreground text-sm">No items scheduled for this time period</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[270px] overflow-y-auto pr-1">
                {filteredAgendaItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-2 border rounded-md hover:bg-accent cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={() => handleAgendaItemClick(item)}
                  >
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-10 h-10 bg-muted rounded-md">
                      <span className="text-xs font-medium">
                        {format(parseISO(item.event_date), "dd")}
                      </span>
                      <span className="text-xs">
                        {format(parseISO(item.event_date), "MMM")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
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
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={handleDeleteAgendaItem} type="button">
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditButtonClick} type="button">
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} type="button">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Agenda Item Dialog */}
      {selectedAgendaItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Agenda Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-title" className="text-right col-span-1">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-date" className="text-right col-span-1">
                  Date
                </label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="edit-date"
                    type="date"
                    value={editDate ? format(editDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setEditDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-time" className="text-right col-span-1">
                  Time
                </label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-description" className="text-right col-span-1">
                  Details
                </label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateAgendaItem}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
