
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DialogActions({ onCancel, onConfirm }: DialogActionsProps) {
  const { toast } = useToast();

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof onCancel !== 'function') {
      console.error("onCancel is not a function:", onCancel);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive"
      });
      return;
    }
    
    onCancel();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Confirm button clicked in DialogActions");
    
    if (typeof onConfirm !== 'function') {
      console.error("onConfirm is not a function:", onConfirm);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive"
      });
      return;
    }
    
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
      <Button 
        onClick={handleConfirm} 
        type="button"
      >
        Confirm
      </Button>
    </div>
  );
}
