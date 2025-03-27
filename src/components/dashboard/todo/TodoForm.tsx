
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { TodoItem } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { TodoDatePicker } from "./TodoDatePicker";
import { TodoNotificationPicker } from "./TodoNotificationPicker";
import { TodoAssignmentFields } from "./TodoAssignmentFields";

interface TodoFormProps {
  item?: TodoItem;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (todoData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
}

export function TodoForm({ item, mode, onClose, onSave }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notifyAt, setNotifyAt] = useState<Date | undefined>(undefined);
  const [notifyTime, setNotifyTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedToId, setAssignedToId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

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
  }, [item]);

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
    <>
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
        
        <TodoDatePicker 
          label="Due Date"
          date={dueDate}
          onDateChange={setDueDate}
        />
        
        <TodoNotificationPicker
          notifyAt={notifyAt}
          notifyTime={notifyTime}
          onNotifyAtChange={setNotifyAt}
          onNotifyTimeChange={setNotifyTime}
        />
        
        <TodoAssignmentFields
          assignedToId={assignedToId}
          propertyId={propertyId}
          onAssignedToIdChange={setAssignedToId}
          onPropertyIdChange={setPropertyId}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title.trim() || isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );
}
