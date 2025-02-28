
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DialogActions({ onCancel, onConfirm }: DialogActionsProps) {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        onClick={handleCancel}
        type="button"
      >
        Cancel
      </Button>
      <Button onClick={handleConfirm} type="button">Confirm</Button>
    </div>
  );
}
