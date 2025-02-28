
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyImage } from "@/types/property";
import { Card } from "@/components/ui/card";
import { ImageGrid } from "./image-select/ImageGrid";
import { DialogActions } from "./image-select/DialogActions";
import { DialogTriggerButton } from "./image-select/DialogTriggerButton";

export interface ImageSelectDialogProps {
  images: PropertyImage[];
  selectedImageIds?: string[];
  onSelect: (selectedIds: string[]) => void;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  maxSelect?: number;
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ImageSelectDialog({
  images,
  selectedImageIds = [],
  onSelect,
  buttonText,
  buttonIcon,
  maxSelect,
  id,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ImageSelectDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedImageIds);
  const [open, setOpen] = useState(false);
  
  // Sync selected state when selectedImageIds prop changes
  useEffect(() => {
    setSelected(selectedImageIds);
  }, [selectedImageIds]);
  
  // Sync internal open state with controlled open state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleToggleSelect = (imageId: string) => {
    console.log("Toggling selection for image:", imageId);
    if (selected.includes(imageId)) {
      setSelected(selected.filter((id) => id !== imageId));
    } else {
      if (maxSelect === 1) {
        setSelected([imageId]);
      } else if (maxSelect && selected.length >= maxSelect) {
        return;
      } else {
        setSelected([...selected, imageId]);
      }
    }
  };

  const handleConfirm = () => {
    console.log("Confirming selection:", selected);
    onSelect(selected);
    handleOpenChange(false);
  };

  const handleCancel = () => {
    console.log("Cancelling selection");
    handleOpenChange(false);
    // Reset selection when cancelling
    setSelected(selectedImageIds);
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Dialog open state changing to:", newOpen);
    setOpen(newOpen);
    
    // Call controlled open change handler if provided
    if (setControlledOpen) {
      setControlledOpen(newOpen);
    }
    
    // Reset selection when opening the dialog
    if (newOpen) {
      setSelected(selectedImageIds);
    }
  };

  // Only render the trigger if we're not controlled
  const trigger = controlledOpen === undefined ? (
    <DialogTrigger asChild>
      <DialogTriggerButton
        buttonText={buttonText}
        buttonIcon={buttonIcon}
        id={id}
        onClick={() => handleOpenChange(true)}
      />
    </DialogTrigger>
  ) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Images from Library</DialogTitle>
        </DialogHeader>
        
        <ImageGrid 
          images={images} 
          selected={selected} 
          onToggleSelect={handleToggleSelect} 
        />
        
        <DialogActions 
          onCancel={handleCancel} 
          onConfirm={handleConfirm} 
        />
      </DialogContent>
    </Dialog>
  );
}
