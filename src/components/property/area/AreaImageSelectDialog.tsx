
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface AreaImageSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: PropertyImage[];
  areaTitle: string;
  selectedImageIds: string[];
  onUpdate: (imageIds: string[]) => void;
}

export function AreaImageSelectDialog({
  open,
  onOpenChange,
  images,
  areaTitle,
  selectedImageIds,
  onUpdate,
}: AreaImageSelectDialogProps) {
  // Local state to manage selection during dialog interaction
  const [localSelection, setLocalSelection] = useState<string[]>([]);
  
  // Update local selection when props change or dialog opens
  useEffect(() => {
    if (open) {
      setLocalSelection([...selectedImageIds]);
    }
  }, [selectedImageIds, open]);

  const toggleImageSelection = (imageId: string) => {
    setLocalSelection(current => {
      if (current.includes(imageId)) {
        // Remove from selection
        return current.filter(id => id !== imageId);
      } else {
        // Add to selection
        return [...current, imageId];
      }
    });
  };
  
  const handleConfirm = () => {
    // Update parent component with the selection
    onUpdate(localSelection);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    // Reset to original selection and close dialog
    setLocalSelection([...selectedImageIds]);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Images for {areaTitle || "Area"}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {images.map((image) => {
              const isSelected = localSelection.includes(image.id);
              return (
                <div
                  key={image.id}
                  className={`
                    relative cursor-pointer border rounded-md overflow-hidden
                    ${isSelected ? "ring-2 ring-primary" : "hover:opacity-80"}
                  `}
                  onClick={() => toggleImageSelection(image.id)}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {images.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No images available. Upload images first.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button onClick={handleConfirm} type="button">
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
