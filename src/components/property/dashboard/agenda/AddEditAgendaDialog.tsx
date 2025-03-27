
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AgendaAddEditDialogProps } from "./types";

export function AddEditAgendaDialog({
  isOpen,
  onOpenChange,
  onSave,
  title,
  setTitle,
  description,
  setDescription,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  additionalUsers,
  setAdditionalUsers,
  availableUsers,
  mode
}: AgendaAddEditDialogProps) {
  const handleRemoveUser = (userId: string) => {
    setAdditionalUsers(additionalUsers.filter(id => id !== userId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Agenda Item" : "Edit Agenda Item"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Add a new event to your agenda." 
              : "Update the details of this agenda item."}
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
            <label htmlFor="startDate" className="text-right col-span-1">
              Start Date
            </label>
            <div className="col-span-3 flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startTime" className="text-right col-span-1">
              Start Time
            </label>
            <Input
              id="startTime"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right col-span-1">
              End Date
            </label>
            <div className="col-span-3 flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Optional</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    defaultMonth={selectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endTime" className="text-right col-span-1">
              End Time
            </label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="additionalUsers" className="text-right col-span-1 pt-2">
              Share With
            </label>
            <div className="col-span-3">
              <Select 
                onValueChange={(value) => {
                  if (!additionalUsers.includes(value)) {
                    setAdditionalUsers([...additionalUsers, value]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select users to share with" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(user => (
                    <SelectItem 
                      key={user.id} 
                      value={user.id}
                      disabled={additionalUsers.includes(user.id)}
                    >
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {additionalUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {additionalUsers.map(userId => {
                    const user = availableUsers.find(u => u.id === userId);
                    return (
                      <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                        {user?.name || "Unknown User"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveUser(userId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            {mode === "add" ? "Add" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
