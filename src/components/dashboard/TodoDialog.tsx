
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TodoItem } from "@/types/todo";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { useAuth } from "@/providers/AuthProvider";
import { TimePicker } from "./TimePicker";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoItem: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: TodoItem;
  mode: "add" | "edit";
}

export function TodoDialog({
  isOpen,
  onClose,
  onSave,
  item,
  mode,
}: TodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notifyDate, setNotifyDate] = useState<Date | undefined>(undefined);
  const [notifyTime, setNotifyTime] = useState<string>("09:00");
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { properties } = usePropertiesSelect();
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setDueDate(item.due_date ? new Date(item.due_date) : undefined);
      setEnableNotification(!!item.notify_at);
      if (item.notify_at) {
        const notifyDateTime = new Date(item.notify_at);
        setNotifyDate(notifyDateTime);
        setNotifyTime(format(notifyDateTime, "HH:mm"));
      }
      setPropertyId(item.property_id || undefined);
      setAssignedTo(item.assigned_to_id || undefined);
      setCompleted(item.completed);
    } else {
      resetForm();
    }
  }, [item]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setEnableNotification(false);
    setNotifyDate(undefined);
    setNotifyTime("09:00");
    setPropertyId(undefined);
    setAssignedTo(undefined);
    setCompleted(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      // Calculate notification datetime if enabled
      let notifyAt: Date | null = null;
      if (enableNotification && notifyDate) {
        const [hours, minutes] = notifyTime.split(':').map(Number);
        notifyAt = new Date(notifyDate);
        notifyAt.setHours(hours, minutes, 0, 0);
      }

      await onSave({
        title,
        description: description || null,
        due_date: dueDate ? dueDate.toISOString() : null,
        notify_at: notifyAt ? notifyAt.toISOString() : null,
        property_id: propertyId || null,
        assigned_to_id: assignedTo || null,
        completed,
        sort_order: item?.sort_order || 0
      });
      
      onClose();
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="completed">Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="completed"
                  checked={completed}
                  onCheckedChange={setCompleted}
                />
                <Label htmlFor="completed" className="cursor-pointer">
                  {completed ? "Completed" : "Active"}
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableNotification">Enable Notification</Label>
              <Switch
                id="enableNotification"
                checked={enableNotification}
                onCheckedChange={setEnableNotification}
              />
            </div>
            
            {enableNotification && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !notifyDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {notifyDate ? format(notifyDate, "PPP") : "Notification date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={notifyDate}
                        onSelect={setNotifyDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <TimePicker value={notifyTime} onChange={setNotifyTime} />
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="property">Related Property (optional)</Label>
            <Select
              value={propertyId || ""}
              onValueChange={(value) => setPropertyId(value || undefined)}
            >
              <SelectTrigger id="property">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isAdmin && (
            <div>
              <Label htmlFor="assignedTo">Assign To (optional)</Label>
              <Select
                value={assignedTo || ""}
                onValueChange={(value) => setAssignedTo(value || undefined)}
              >
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
