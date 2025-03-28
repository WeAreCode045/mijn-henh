
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogFooterProps {
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  mode: "add" | "edit";
}

export function AgendaDialogFooter({ onOpenChange, onSave, mode }: DialogFooterProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
        Cancel
      </Button>
      <Button type="button" onClick={onSave}>
        {mode === "add" ? "Add" : "Save Changes"}
      </Button>
    </DialogFooter>
  );
}
