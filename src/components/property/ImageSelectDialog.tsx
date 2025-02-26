
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import type { PropertyImage } from "@/types/property";

interface ImageSelectDialogProps {
  images: PropertyImage[];
  onSelect: (imageIds: string[]) => void;
  buttonText: string;
  maxSelect?: number;
}

export function ImageSelectDialog({
  images = [],
  onSelect,
  buttonText,
  maxSelect,
}: ImageSelectDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageClick = (imageId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      }
      if (maxSelect && prev.length >= maxSelect) {
        return prev;
      }
      return [...prev, imageId];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    setOpen(false);
    setSelectedImages([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Image className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Images</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-4">
          {images?.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(image.id)}
            >
              <img
                src={image.url}
                alt="Property"
                className={`w-full aspect-square object-cover rounded-lg transition-all ${
                  selectedImages.includes(image.id) 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'
                }`}
              />
              {selectedImages.includes(image.id) && (
                <div className="absolute top-2 right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {selectedImages.indexOf(image.id) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-muted-foreground">
              {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
              {maxSelect ? ` (max ${maxSelect})` : ''}
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={selectedImages.length === 0}>
                Add Selected
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
