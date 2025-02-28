
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyImage } from "@/types/property";
import { useState } from "react";
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
}

export function ImageSelectDialog({
  images,
  selectedImageIds = [],
  onSelect,
  buttonText,
  buttonIcon,
  maxSelect,
  id,
}: ImageSelectDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedImageIds);
  const [open, setOpen] = useState(false);

  const handleToggleSelect = (imageId: string) => {
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
    onSelect(selected);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelected(selectedImageIds);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          buttonText={buttonText}
          buttonIcon={buttonIcon}
          id={id}
        />
      </DialogTrigger>
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
