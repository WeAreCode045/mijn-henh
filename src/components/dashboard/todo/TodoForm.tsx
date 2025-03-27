
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { TodoAssignmentFields } from "./TodoAssignmentFields";
import { TodoNotificationPicker } from "./TodoNotificationPicker";
import { TodoItem } from "@/hooks/todo/types";

interface TodoFormProps {
  item?: TodoItem;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (todoData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
}

export function TodoForm({ item, mode, onClose, onSave }: TodoFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    item?.due_date ? new Date(item.due_date) : undefined
  );
  const [assignedToId, setAssignedToId] = useState<string | undefined>(
    item?.assigned_to_id
  );
  const [propertyId, setPropertyId] = useState<string | undefined>(
    item?.property_id
  );
  const [completed, setCompleted] = useState(item?.completed || false);
  const [enableNotification, setEnableNotification] = useState(!!item?.notify_at);
  const [notificationTime, setNotificationTime] = useState<Date>(
    item?.notify_at ? new Date(item.notify_at) : new Date()
  );
  const [notificationTimeStr, setNotificationTimeStr] = useState(
    item?.notify_at 
      ? format(new Date(item.notify_at), "HH:mm") 
      : "09:00"
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare notification time if enabled
      let notifyAt = null;
      if (enableNotification && dueDate) {
        const [hours, minutes] = notificationTimeStr.split(':').map(Number);
        const notifyDate = new Date(dueDate);
        notifyDate.setHours(hours, minutes, 0, 0);
        notifyAt = notifyDate;
      }
      
      await onSave({
        title,
        description,
        due_date: dueDate,
        assigned_to_id: assignedToId,
        property_id: propertyId,
        completed,
        notify_at: notifyAt,
        notification_sent: item?.notification_sent || false,
        sort_order: item?.sort_order || 0
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving todo item:", error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dueDate"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
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
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="enableNotification"
            checked={enableNotification}
            onCheckedChange={setEnableNotification}
          />
          <Label htmlFor="enableNotification">Enable Notification</Label>
        </div>
        
        {enableNotification && dueDate && (
          <div className="pt-2">
            <TodoNotificationPicker
              value={notificationTime}
              onChange={setNotificationTime}
              timeValue={notificationTimeStr}
              onTimeChange={setNotificationTimeStr}
            />
          </div>
        )}
      </div>
      
      <TodoAssignmentFields
        assignedToId={assignedToId}
        propertyId={propertyId}
        onAssignedToChange={setAssignedToId}
        onPropertyChange={setPropertyId}
      />
      
      {mode === "edit" && (
        <div className="flex items-center space-x-2">
          <Switch
            id="completed"
            checked={completed}
            onCheckedChange={setCompleted}
          />
          <Label htmlFor="completed" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as completed
          </Label>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Update Task"}
        </Button>
      </div>
    </form>
  );
}
