
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DialogActions({ onCancel, onConfirm }: DialogActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </div>
  );
}
