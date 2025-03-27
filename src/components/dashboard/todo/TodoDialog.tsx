
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TodoItem } from "@/hooks/useTodoItems";
import { TodoDatePicker } from "./TodoDatePicker";
import { TodoNotificationPicker } from "./TodoNotificationPicker";
import { TodoAssignmentFields } from "./TodoAssignmentFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProperties } from "@/hooks/useProperties";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: TodoItem;
  mode: "add" | "edit";
}

export function TodoDialog({ isOpen, onClose, onSave, item, mode }: TodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notifyAt, setNotifyAt] = useState<Date | undefined>(undefined);
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined);
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { properties, isLoading: propertiesLoading } = useProperties();

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setDueDate(item.due_date ? new Date(item.due_date) : undefined);
      setNotifyAt(item.notify_at ? new Date(item.notify_at) : undefined);
      setAssignedToId(item.assigned_to_id || undefined);
      setPropertyId(item.property_id || undefined);
    } else {
      // Reset form for new items
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setNotifyAt(undefined);
      setAssignedToId(undefined);
      setPropertyId(undefined);
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        title,
        description,
        due_date: dueDate,
        notify_at: notifyAt,
        notification_sent: item?.notification_sent || false,
        completed: item?.completed || false,
        property_id: propertyId,
        assigned_to_id: assignedToId,
        sort_order: item?.sort_order || 0
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving todo item:", error);
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
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <TodoDatePicker 
                value={dueDate} 
                onChange={setDueDate} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notification</Label>
              <TodoNotificationPicker 
                value={notifyAt}
                onChange={setNotifyAt}
              />
            </div>
          </div>
          
          <TodoAssignmentFields 
            assignedToId={assignedToId}
            onAssignedToChange={setAssignedToId}
          />
          
          <div className="space-y-2">
            <Label htmlFor="property">Related Property</Label>
            <Select 
              value={propertyId || ""} 
              onValueChange={(value) => setPropertyId(value || undefined)}
            >
              <SelectTrigger id="property">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No property</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Task" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
