
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DialogActions({ onCancel, onConfirm }: DialogActionsProps) {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error("onCancel is not a function:", onCancel);
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Confirm button clicked in DialogActions");
    if (typeof onConfirm === 'function') {
      onConfirm();
    } else {
      console.error("onConfirm is not a function:", onConfirm);
    }
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
      <Button 
        onClick={handleConfirm} 
        type="button"
      >
        Confirm
      </Button>
    </div>
  );
}
