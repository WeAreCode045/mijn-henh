
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "@/hooks/todo/types";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: TodoItem;
  mode: "add" | "edit";
}

export function TodoDialog({ isOpen, onClose, onSave, item, mode }: TodoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        
        <TodoForm 
          item={item}
          mode={mode}
          onClose={onClose}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}
