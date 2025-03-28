
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  mode: "add" | "edit";
}

export function AgendaDialogHeader({ mode }: DialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>{mode === "add" ? "Add New Agenda Item" : "Edit Agenda Item"}</DialogTitle>
      <DialogDescription>
        {mode === "add" 
          ? "Add a new event to your agenda." 
          : "Update the details of this agenda item."}
      </DialogDescription>
    </DialogHeader>
  );
}
