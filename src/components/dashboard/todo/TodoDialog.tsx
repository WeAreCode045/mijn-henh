
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TodoItem } from "@/types/todo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TimePicker } from "../TimePicker";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: TodoItem;
  mode: "add" | "edit";
}

export function TodoDialog({ isOpen, onClose, onSave, item, mode }: TodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notifyAt, setNotifyAt] = useState<Date | undefined>(undefined);
  const [notifyTime, setNotifyTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedToId, setAssignedToId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [agents, setAgents] = useState<{id: string; full_name: string}[]>([]);
  const [properties, setProperties] = useState<{id: string; title: string}[]>([]);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setDueDate(item.due_date ? new Date(item.due_date) : undefined);
      setAssignedToId(item.assigned_to_id);
      setPropertyId(item.property_id);
      
      if (item.notify_at) {
        const notifyDate = new Date(item.notify_at);
        setNotifyAt(notifyDate);
        setNotifyTime(format(notifyDate, "HH:mm"));
      } else {
        setNotifyAt(undefined);
        setNotifyTime("12:00");
      }
    } else {
      resetForm();
    }
  }, [item, isOpen]);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
        
      if (!error && data) {
        setAgents(data);
      }
    };
    
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('archived', false)
        .order('title');
        
      if (!error && data) {
        setProperties(data);
      }
    };
    
    fetchAgents();
    fetchProperties();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setNotifyAt(undefined);
    setNotifyTime("12:00");
    setAssignedToId(null);
    setPropertyId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare notification date if both date and time are set
      let notifyDateTime = null;
      if (notifyAt) {
        const [hours, minutes] = notifyTime.split(':').map(Number);
        const notifyAtDate = new Date(notifyAt);
        notifyAtDate.setHours(hours, minutes, 0, 0);
        notifyDateTime = notifyAtDate.toISOString();
      }
      
      await onSave({
        title,
        description: description || null,
        due_date: dueDate ? dueDate.toISOString() : null,
        notify_at: notifyDateTime,
        notification_sent: false,
        completed: item?.completed || false,
        property_id: propertyId,
        assigned_to_id: assignedToId,
        sort_order: item?.sort_order || 0
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving todo item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new task to keep track of your to-dos." 
              : "Update this task's details."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
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
            {dueDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1" 
                onClick={() => setDueDate(undefined)}
              >
                Clear date
              </Button>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label>Set Notification (optional)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !notifyAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {notifyAt ? format(notifyAt, "PPP") : "Notification date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={notifyAt}
                      onSelect={setNotifyAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-24">
                <TimePicker
                  value={notifyTime}
                  onChange={setNotifyTime}
                />
              </div>
            </div>
            {notifyAt && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1" 
                onClick={() => setNotifyAt(undefined)}
              >
                Clear notification
              </Button>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="agent">Assign to Agent (optional)</Label>
            <Select 
              value={assignedToId || ""} 
              onValueChange={(value) => setAssignedToId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="property">Assign to Property (optional)</Label>
            <Select 
              value={propertyId || ""} 
              onValueChange={(value) => setPropertyId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
