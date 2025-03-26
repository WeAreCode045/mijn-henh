
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodoItem } from "@/types/todo";
import { TodoForm } from "./TodoForm";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: TodoItem;
  mode: "add" | "edit";
}

export function TodoDialog({ isOpen, onClose, onSave, item, mode }: TodoDialogProps) {
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
