
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AgendaDialogHeaderProps {
  mode: "add" | "edit";
}

export function AgendaDialogHeader({ mode }: AgendaDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {mode === "add" ? "Add New" : "Edit"} Agenda Item
      </DialogTitle>
      <DialogDescription>
        {mode === "add"
          ? "Create a new agenda item for your calendar."
          : "Update the details of this agenda item."}
      </DialogDescription>
    </DialogHeader>
  );
}
