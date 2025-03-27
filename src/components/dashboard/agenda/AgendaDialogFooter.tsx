
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface AgendaDialogFooterProps {
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  mode: "add" | "edit";
}

export function AgendaDialogFooter({
  onClose,
  onSave,
  isSaving,
  mode
}: AgendaDialogFooterProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? "Saving..." : mode === "add" ? "Add" : "Save changes"}
      </Button>
    </DialogFooter>
  );
}
