
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyImage } from "@/types/property";
import { Check } from "lucide-react";
import { useState } from "react";

export interface ImageSelectDialogProps {
  images: PropertyImage[];
  selectedImageIds?: string[];
  onSelect: (selectedIds: string[]) => void;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  maxSelect?: number;
}

export function ImageSelectDialog({
  images,
  selectedImageIds = [],
  onSelect,
  buttonText,
  buttonIcon,
  maxSelect,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          {buttonIcon}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Images from Library</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                selected.includes(image.id)
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => handleToggleSelect(image.id)}
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-24 object-cover"
              />
              {selected.includes(image.id) && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-1 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelected(selectedImageIds);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
