
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PropertyImage } from "@/types/property";
import { Card } from "@/components/ui/card";
import { ImageGrid } from "./image-select/ImageGrid";
import { DialogActions } from "./image-select/DialogActions";
import { DialogTriggerButton } from "./image-select/DialogTriggerButton";
import { useToast } from "@/components/ui/use-toast";

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
  singleSelect?: boolean; // Added prop for single select mode
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
  singleSelect = false, // Default to multi-select
}: ImageSelectDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedImageIds);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
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
    
    if (singleSelect) {
      // In single select mode, just replace the selection
      setSelected([imageId]);
      return;
    }
    
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
    
    // Verify onSelect is a function before calling it
    if (typeof onSelect !== 'function') {
      console.error("onSelect is not a function:", onSelect);
      toast({
        title: "Error",
        description: "An error occurred while processing your selection.",
        variant: "destructive"
      });
      handleOpenChange(false);
      return;
    }
    
    // Call the onSelect function
    onSelect(selected);
    
    // Close the dialog
    handleOpenChange(false);
  };

  const handleCancel = () => {
    console.log("Cancelling selection");
    // Reset selection when cancelling
    setSelected(selectedImageIds);
    handleOpenChange(false);
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
    <DialogTriggerButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      id={id}
      onClick={() => handleOpenChange(true)}
    />
  ) : null;

  // Fix: Extract image URLs for the ImageGrid component
  const imageUrls = images.map(img => img.url);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Images from Library</DialogTitle>
          <DialogDescription>
            {singleSelect 
              ? "Choose an image to use as featured image." 
              : `Select up to ${maxSelect || 'multiple'} images.`}
          </DialogDescription>
        </DialogHeader>
        
        <ImageGrid 
          images={imageUrls} 
          selected={selected} 
          onSelect={handleToggleSelect} 
          selectionMode={singleSelect ? "single" : "multiple"}
        />
        
        <DialogActions 
          onCancel={handleCancel} 
          onConfirm={handleConfirm} 
        />
      </DialogContent>
    </Dialog>
  );
}
